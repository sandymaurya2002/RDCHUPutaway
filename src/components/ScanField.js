import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors, Typography, Spacing, Radius} from '../config/theme';

const ScanField = ({
  stepNum,
  label,
  value,
  onScanPress,
  onClear,
  disabled = false,
  loading = false,
  validated = false,
  error = false,
  placeholder = 'Scan barcode...',
}) => {
  const getBorderColor = () => {
    if (error) return Colors.error;
    if (validated) return Colors.success;
    if (disabled) return Colors.border;
    return Colors.primary;
  };

  const getStatusDot = () => {
    if (loading) return null;
    if (validated) return {color: Colors.success, text: '●'};
    if (error) return {color: Colors.error, text: '●'};
    if (!disabled && !value) return {color: Colors.warning, text: '●'};
    return null;
  };

  const dot = getStatusDot();

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      {/* Step Header */}
      <View style={styles.header}>
        <View style={[styles.stepBadge, {backgroundColor: disabled ? Colors.disabled : Colors.primary}]}>
          <Text style={styles.stepNum}>{stepNum}</Text>
        </View>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        {dot && <Text style={[styles.dot, {color: dot.color}]}>{dot.text}</Text>}
        {loading && <ActivityIndicator size="small" color={Colors.primary} />}
      </View>

      {/* Value Box */}
      <View style={[styles.valueBox, {borderColor: getBorderColor()}]}>
        {value ? (
          <View style={styles.valueRow}>
            <Text style={[styles.valueText, error && {color: Colors.error}]} numberOfLines={1}>
              {value}
            </Text>
            {!disabled && !loading && (
              <TouchableOpacity onPress={onClear} style={styles.clearBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.placeholder}>{disabled ? 'Complete previous step first' : placeholder}</Text>
        )}
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.scanBtn, disabled && styles.scanBtnDisabled, validated && styles.scanBtnSuccess]}
        onPress={onScanPress}
        disabled={disabled || loading}
        activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator color={Colors.textLight} size="small" />
        ) : (
          <>
            <Text style={styles.scanIcon}>📷</Text>
            <Text style={[styles.scanBtnText, disabled && {opacity: 0.5}]}>
              {validated ? `RE-SCAN ${label}` : `SCAN ${label}`}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  containerDisabled: {opacity: 0.65},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm},
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  stepNum: {color: '#FFF', fontWeight: '800', fontSize: 13},
  label: {...Typography.labelLarge, color: Colors.text, flex: 1},
  labelDisabled: {color: Colors.disabled},
  dot: {fontSize: 14, marginLeft: 4},
  valueBox: {
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  valueRow: {flexDirection: 'row', alignItems: 'center'},
  valueText: {...Typography.valueSmall, color: Colors.text, flex: 1},
  clearBtn: {padding: 4},
  clearIcon: {fontSize: 14, color: Colors.textSecondary},
  placeholder: {...Typography.body, color: Colors.textSecondary, fontStyle: 'italic'},
  scanBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanBtnDisabled: {backgroundColor: Colors.disabledBg},
  scanBtnSuccess: {backgroundColor: Colors.scanActive},
  scanIcon: {fontSize: 18},
  scanBtnText: {...Typography.labelLarge, color: Colors.textLight, letterSpacing: 0.8},
});

export default ScanField;
