import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Vibration,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Colors, Typography, Spacing, Radius} from '../config/theme';

const {width, height} = Dimensions.get('window');
const SCAN_AREA = width * 0.75;

const ScannerModal = ({visible, onScan, onClose, label, hint}) => {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [torch, setTorch] = useState(false);
  const lastScannedRef = useRef(null);
  const scanCooldownRef = useRef(false);

  useEffect(() => {
    if (visible) {
      Camera.requestCameraPermission().then(status => {
        setHasPermission(status === 'granted');
      });
      lastScannedRef.current = null;
      scanCooldownRef.current = false;
    }
    return () => {
      setTorch(false);
    };
  }, [visible]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'data-matrix', 'pdf-417', 'aztec', 'upc-a', 'upc-e'],
    onCodeScanned: useCallback(codes => {
      if (scanCooldownRef.current) return;
      const code = codes?.[0]?.value;
      if (!code || code === lastScannedRef.current) return;

      lastScannedRef.current = code;
      scanCooldownRef.current = true;
      Vibration.vibrate(80);

      onScan(code);

      // Cooldown to prevent double scan
      setTimeout(() => {
        scanCooldownRef.current = false;
      }, 1500);
    }, [onScan]),
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.container}>
        {device && hasPermission ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={visible}
            codeScanner={codeScanner}
            torch={torch ? 'on' : 'off'}
            enableZoomGesture
          />
        ) : (
          <View style={styles.noCamera}>
            <Text style={styles.noCameraText}>📷 Camera not available</Text>
            <Text style={styles.noCameraHint}>Check camera permissions in Settings</Text>
          </View>
        )}

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.labelContainer}>
              <Text style={styles.scanLabel}>{label}</Text>
              {hint ? <Text style={styles.scanHint}>{hint}</Text> : null}
            </View>
            <TouchableOpacity
              onPress={() => setTorch(t => !t)}
              style={[styles.torchBtn, torch && styles.torchActive]}>
              <Text style={styles.torchIcon}>🔦</Text>
            </TouchableOpacity>
          </View>

          {/* Scan frame */}
          <View style={styles.scanFrameArea}>
            <View style={styles.scanFrame}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          {/* Bottom bar */}
          <View style={styles.bottomBar}>
            <Text style={styles.instructionText}>Point camera at barcode</Text>
            <TouchableOpacity style={styles.manualBtn} onPress={onClose}>
              <Text style={styles.manualBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  noCameraText: {fontSize: 20, color: '#FFF', marginBottom: 8},
  noCameraHint: {fontSize: 14, color: '#999'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingTop: 48,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {color: '#FFF', fontSize: 18, fontWeight: '700'},
  labelContainer: {flex: 1, alignItems: 'center'},
  scanLabel: {...Typography.heading, color: '#FFF'},
  scanHint: {...Typography.caption, color: '#90CAF9', marginTop: 2},
  torchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchActive: {backgroundColor: 'rgba(255,200,0,0.4)'},
  torchIcon: {fontSize: 20},
  scanFrameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: SCAN_AREA,
    height: SCAN_AREA * 0.5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.accent,
    borderWidth: 3,
  },
  cornerTL: {top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0},
  cornerTR: {top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0},
  cornerBL: {bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0},
  cornerBR: {bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0},
  bottomBar: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: Spacing.lg,
    paddingBottom: 36,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  instructionText: {...Typography.body, color: '#90CAF9', marginBottom: Spacing.md},
  manualBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
  },
  manualBtnText: {...Typography.labelMedium, color: '#FFF', letterSpacing: 1},
});

export default ScannerModal;
