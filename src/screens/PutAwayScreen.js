import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import {Colors, Typography, Spacing, Radius} from '../config/theme';
import {STICKY_BIN_PREFIX} from '../config/appConfig';
import {validateBin, validateHU, savePutaway} from '../services/api';
import ScannerModal from '../components/ScannerModal';
import ScanField from '../components/ScanField';
import StatusMessage from '../components/StatusMessage';

// ─── SCAN STEP ENUM ──────────────────────────────────────────────────────────
const SCAN_TARGET = {BIN: 'BIN', HU: 'HU'};

const PutAwayScreen = ({navigation, route}) => {
  const {user, plant} = route.params;

  // ─── STATE ────────────────────────────────────────────────────────────────
  const [bin, setBin] = useState('');
  const [hu, setHu] = useState('');
  const [binValidated, setBinValidated] = useState(false);
  const [huValidated, setHuValidated] = useState(false);
  const [binError, setBinError] = useState('');
  const [huError, setHuError] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // {type, message}
  const [loading, setLoading] = useState({bin: false, hu: false, save: false});
  const [scanTarget, setScanTarget] = useState(null); // null | 'BIN' | 'HU'
  const [successVisible, setSuccessVisible] = useState(false);

  // Animation for success modal
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // ─── SCANNER OPEN/CLOSE ───────────────────────────────────────────────────
  const openScanner = (target) => setScanTarget(target);
  const closeScanner = () => setScanTarget(null);

  // ─── RESET ────────────────────────────────────────────────────────────────
  const resetForNextScan = (keepBin = false) => {
    setHu('');
    setHuValidated(false);
    setHuError('');
    setBinError('');
    setSaveStatus(null);
    if (!keepBin) {
      setBin('');
      setBinValidated(false);
    }
  };

  // ─── BIN CLEAR ────────────────────────────────────────────────────────────
  const clearBin = () => {
    setBin('');
    setBinValidated(false);
    setBinError('');
    setHu('');
    setHuValidated(false);
    setHuError('');
    setSaveStatus(null);
  };

  // ─── HU CLEAR ─────────────────────────────────────────────────────────────
  const clearHu = () => {
    setHu('');
    setHuValidated(false);
    setHuError('');
    setSaveStatus(null);
  };

  // ─── HANDLE SCAN RESULT ───────────────────────────────────────────────────
  const handleScan = useCallback(async (scannedValue) => {
    closeScanner();
    const cleaned = scannedValue.trim();
    if (!cleaned) return;

    if (scanTarget === SCAN_TARGET.BIN) {
      await processBin(cleaned);
    } else if (scanTarget === SCAN_TARGET.HU) {
      await processHU(cleaned);
    }
  }, [scanTarget, bin, user, plant]); // eslint-disable-line

  // ─── PROCESS BIN ─────────────────────────────────────────────────────────
  const processBin = async (scannedBin) => {
    setBin(scannedBin);
    setBinValidated(false);
    setBinError('');
    setHu('');
    setHuValidated(false);
    setHuError('');
    setSaveStatus(null);
    setLoading(l => ({...l, bin: true}));

    try {
      const res = await validateBin(user, plant, scannedBin);
      if (res.Status === 'S') {
        setBinValidated(true);
      } else {
        setBinError(res.Message || 'BIN validation failed.');
      }
    } catch (err) {
      setBinError(err.Message || 'Network error during BIN validation.');
    } finally {
      setLoading(l => ({...l, bin: false}));
    }
  };

  // ─── PROCESS HU ──────────────────────────────────────────────────────────
  const processHU = async (scannedHU) => {
    setHu(scannedHU);
    setHuValidated(false);
    setHuError('');
    setSaveStatus(null);
    setLoading(l => ({...l, hu: true}));

    try {
      const res = await validateHU(user, plant, bin, scannedHU);
      if (res.Status === 'S') {
        setHuValidated(true);
      } else {
        setHuError(res.Message || 'HU validation failed.');
      }
    } catch (err) {
      setHuError(err.Message || 'Network error during HU validation.');
    } finally {
      setLoading(l => ({...l, hu: false}));
    }
  };

  // ─── SAVE ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!binValidated || !huValidated) return;
    setSaveStatus(null);
    setLoading(l => ({...l, save: true}));

    try {
      const res = await savePutaway(user, plant, bin, hu);
      if (res.Status === 'S') {
        // Show success modal
        setSuccessVisible(true);
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();

        // Auto-dismiss after 2s and reset
        setTimeout(() => {
          setSuccessVisible(false);
          scaleAnim.setValue(0);
          const keepBin = bin.startsWith(STICKY_BIN_PREFIX);
          resetForNextScan(keepBin);
        }, 2000);
      } else {
        setSaveStatus({type: 'error', message: res.Message || 'Save failed.'});
      }
    } catch (err) {
      setSaveStatus({type: 'error', message: err.Message || 'Network error during save.'});
    } finally {
      setLoading(l => ({...l, save: false}));
    }
  };

  // ─── DERIVED ──────────────────────────────────────────────────────────────
  const canSaveNow = binValidated && huValidated && !loading.save;
  const isStickyBin = binValidated && bin.startsWith(STICKY_BIN_PREFIX);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>HU PUTAWAY</Text>
          <Text style={styles.headerSub}>RDC TO RDC</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionText}>{user} | {plant}</Text>
          {isStickyBin && (
            <View style={styles.stickyBadge}>
              <Text style={styles.stickyText}>📌 STICKY BIN</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Progress indicator */}
        <View style={styles.progressRow}>
          {['BIN', 'HU', 'SAVE'].map((step, i) => {
            const done = i === 0 ? binValidated : i === 1 ? huValidated : false;
            const active = i === 0 ? !binValidated : i === 1 ? binValidated && !huValidated : binValidated && huValidated;
            return (
              <React.Fragment key={step}>
                <View style={[styles.progressStep, done && styles.progressStepDone, active && styles.progressStepActive]}>
                  <Text style={[styles.progressStepText, (done || active) && {color: '#FFF'}]}>
                    {done ? '✓' : step}
                  </Text>
                </View>
                {i < 2 && <View style={[styles.progressLine, done && styles.progressLineDone]} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* BIN Section */}
        <ScanField
          stepNum="1"
          label="BIN"
          value={bin}
          onScanPress={() => openScanner(SCAN_TARGET.BIN)}
          onClear={clearBin}
          loading={loading.bin}
          validated={binValidated}
          error={!!binError}
          placeholder="Scan BIN barcode..."
        />
        <StatusMessage type="error" message={binError} visible={!!binError} />
        {binValidated && (
          <StatusMessage
            type="success"
            message={`BIN validated${isStickyBin ? ' (Sticky – will retain after save)' : ''}`}
            visible
          />
        )}

        {/* HU Section */}
        <ScanField
          stepNum="2"
          label="HU"
          value={hu}
          onScanPress={() => openScanner(SCAN_TARGET.HU)}
          onClear={clearHu}
          disabled={!binValidated}
          loading={loading.hu}
          validated={huValidated}
          error={!!huError}
          placeholder="Scan HU barcode..."
        />
        <StatusMessage type="error" message={huError} visible={!!huError} />
        {huValidated && <StatusMessage type="success" message="HU validated" visible />}

        {/* Save status */}
        {saveStatus && (
          <StatusMessage type={saveStatus.type} message={saveStatus.message} visible />
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveBtn, !canSaveNow && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSaveNow}
          activeOpacity={0.85}>
          {loading.save ? (
            <ActivityIndicator color={Colors.textLight} size="large" />
          ) : (
            <>
              <Text style={styles.saveIcon}>💾</Text>
              <Text style={[styles.saveBtnText, !canSaveNow && styles.saveBtnTextDisabled]}>
                SAVE PUTAWAY
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info strip */}
        {canSaveNow && (
          <View style={styles.infoStrip}>
            <Text style={styles.infoText}>
              Ready to save: {bin} → {hu}
            </Text>
          </View>
        )}

        {/* Reset button */}
        {(bin || hu) && !loading.save && (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => resetForNextScan(false)}
            activeOpacity={0.7}>
            <Text style={styles.resetBtnText}>🔄  RESET ALL</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Scanner Modal */}
      <ScannerModal
        visible={!!scanTarget}
        onScan={handleScan}
        onClose={closeScanner}
        label={`SCAN ${scanTarget || ''}`}
        hint={scanTarget === SCAN_TARGET.HU ? `BIN: ${bin}` : undefined}
      />

      {/* Success Modal */}
      <Modal transparent visible={successVisible} animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.successCard, {transform: [{scale: scaleAnim}]}]}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>SAVED!</Text>
            <Text style={styles.successSub}>Putaway recorded successfully</Text>
            <Text style={styles.successDetail}>{bin} → {hu}</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.headerBg,
    paddingTop: 48,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {paddingRight: Spacing.sm, paddingVertical: 4},
  backIcon: {color: '#FFF', fontSize: 36, fontWeight: '300', lineHeight: 36},
  headerCenter: {flex: 1},
  headerTitle: {...Typography.heading, color: Colors.textLight},
  headerSub: {...Typography.caption, color: '#90CAF9', marginTop: 2},
  sessionInfo: {alignItems: 'flex-end'},
  sessionText: {...Typography.caption, color: '#90CAF9'},
  stickyBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  stickyText: {fontSize: 10, fontWeight: '700', color: '#FFF'},
  scroll: {padding: Spacing.md, paddingBottom: 48},
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  progressStep: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.disabledBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  progressStepActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  progressStepDone: {backgroundColor: Colors.success, borderColor: Colors.success},
  progressStepText: {...Typography.labelMedium, color: Colors.textSecondary},
  progressLine: {flex: 1, height: 3, backgroundColor: Colors.disabledBg, maxWidth: 40},
  progressLineDone: {backgroundColor: Colors.success},
  saveBtn: {
    backgroundColor: Colors.success,
    borderRadius: Radius.md,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    elevation: 4,
    shadowColor: Colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    gap: 10,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.disabledBg,
    elevation: 0,
    shadowOpacity: 0,
  },
  saveIcon: {fontSize: 22},
  saveBtnText: {...Typography.button, color: Colors.textLight},
  saveBtnTextDisabled: {color: Colors.disabled},
  infoStrip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  infoText: {...Typography.caption, color: Colors.primary},
  resetBtn: {
    marginTop: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetBtnText: {...Typography.labelMedium, color: Colors.textSecondary, letterSpacing: 0.5},
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '80%',
    elevation: 20,
  },
  successIcon: {fontSize: 64, marginBottom: Spacing.sm},
  successTitle: {...Typography.headingLarge, color: Colors.success, marginBottom: 4},
  successSub: {...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.sm},
  successDetail: {...Typography.labelMedium, color: Colors.primary},
});

export default PutAwayScreen;
