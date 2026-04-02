import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography, Spacing, Radius} from '../config/theme';

const STATUS = {
  success: {bg: Colors.successLight, border: Colors.success, icon: '✅', color: Colors.success},
  error: {bg: Colors.errorLight, border: Colors.error, icon: '❌', color: Colors.error},
  info: {bg: Colors.primaryLight, border: Colors.primary, icon: 'ℹ️', color: Colors.primary},
  warning: {bg: Colors.warningLight, border: Colors.warning, icon: '⚠️', color: Colors.warning},
};

const StatusMessage = ({type = 'info', message, visible = true}) => {
  if (!visible || !message) return null;
  const s = STATUS[type] || STATUS.info;

  return (
    <View style={[styles.container, {backgroundColor: s.bg, borderLeftColor: s.border}]}>
      <Text style={styles.icon}>{s.icon}</Text>
      <Text style={[styles.message, {color: s.color}]} numberOfLines={3}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  icon: {fontSize: 16, marginRight: Spacing.sm, marginTop: 1},
  message: {...Typography.body, flex: 1, lineHeight: 22},
});

export default StatusMessage;
