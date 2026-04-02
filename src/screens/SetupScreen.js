import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import {Colors, Typography, Spacing, Radius} from '../config/theme';
import {USERS, PLANTS, DEFAULTS} from '../config/appConfig';

const SetupScreen = ({navigation}) => {
  const [selectedUser, setSelectedUser] = useState(DEFAULTS.USER);
  const [selectedPlant, setSelectedPlant] = useState(DEFAULTS.PLANT);

  const handleProceed = () => {
    navigation.replace('Home', {user: selectedUser, plant: selectedPlant});
  };

  const SelectGroup = ({label, items, value, onChange}) => (
    <View style={styles.selectGroup}>
      <Text style={styles.selectLabel}>{label}</Text>
      {items.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[styles.selectItem, value === item.value && styles.selectItemActive]}
          onPress={() => onChange(item.value)}
          activeOpacity={0.7}>
          <View style={[styles.radio, value === item.value && styles.radioActive]}>
            {value === item.value && <View style={styles.radioDot} />}
          </View>
          <Text
            style={[
              styles.selectItemText,
              value === item.value && styles.selectItemTextActive,
            ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Setup</Text>
        <Text style={styles.headerSub}>Select User & Plant to continue</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SelectGroup
          label="👤  SELECT USER ID"
          items={USERS}
          value={selectedUser}
          onChange={setSelectedUser}
        />
        <SelectGroup
          label="🏭  SELECT PLANT"
          items={PLANTS}
          value={selectedPlant}
          onChange={setSelectedPlant}
        />

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ACTIVE SESSION</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>User ID</Text>
            <Text style={styles.summaryValue}>{selectedUser}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plant</Text>
            <Text style={styles.summaryValue}>{selectedPlant}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedBtnText}>PROCEED →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.headerBg,
    paddingTop: 48,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    ...Typography.headingLarge,
    color: Colors.textLight,
  },
  headerSub: {
    ...Typography.body,
    color: '#90CAF9',
    marginTop: 4,
  },
  scroll: {padding: Spacing.md, paddingBottom: Spacing.xxl},
  selectGroup: {
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
  selectLabel: {
    ...Typography.labelLarge,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: 4,
  },
  selectItemActive: {backgroundColor: Colors.primaryLight},
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  radioActive: {borderColor: Colors.primary},
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  selectItemText: {...Typography.bodyLarge, color: Colors.text},
  selectItemTextActive: {color: Colors.primary, fontWeight: '700'},
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    ...Typography.caption,
    color: '#90CAF9',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {...Typography.body, color: '#90CAF9'},
  summaryValue: {...Typography.value, color: Colors.textLight},
  summaryDivider: {height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4},
  proceedBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  proceedBtnText: {...Typography.button, color: Colors.textLight},
});

export default SetupScreen;
