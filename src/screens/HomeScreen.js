import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Colors, Typography, Spacing, Radius} from '../config/theme';

const HomeScreen = ({navigation, route}) => {
  const {user, plant} = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🏭 Warehouse Ops</Text>
          <Text style={styles.headerSub}>RDC Operations Menu</Text>
        </View>
        <TouchableOpacity
          style={styles.sessionBadge}
          onPress={() => navigation.replace('Setup')}>
          <Text style={styles.sessionUser}>👤 {user}</Text>
          <Text style={styles.sessionPlant}>📍 {plant}</Text>
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate('PutAway', {user, plant})}
          activeOpacity={0.85}>
          <View style={styles.tileIconContainer}>
            <Text style={styles.tileIcon}>📦</Text>
          </View>
          <View style={styles.tileContent}>
            <Text style={styles.tileTitle}>RDC TO RDC</Text>
            <Text style={styles.tileSub}>HU PUTAWAY</Text>
            <Text style={styles.tileDesc}>Scan BIN → Scan HU → Save</Text>
          </View>
          <Text style={styles.tileArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap the tile to begin scanning</Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {...Typography.headingLarge, color: Colors.textLight},
  headerSub: {...Typography.body, color: '#90CAF9', marginTop: 2},
  sessionBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    alignItems: 'flex-end',
  },
  sessionUser: {...Typography.labelMedium, color: Colors.textLight},
  sessionPlant: {...Typography.caption, color: '#90CAF9', marginTop: 2},
  menuContainer: {flex: 1, padding: Spacing.md, justifyContent: 'center'},
  tile: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
  },
  tileIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  tileIcon: {fontSize: 36},
  tileContent: {flex: 1},
  tileTitle: {...Typography.heading, color: Colors.primary},
  tileSub: {...Typography.labelLarge, color: Colors.primaryDark, marginTop: 2},
  tileDesc: {...Typography.caption, color: Colors.textSecondary, marginTop: 6},
  tileArrow: {fontSize: 36, color: Colors.primary, fontWeight: '300'},
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {...Typography.caption, color: Colors.textSecondary},
});

export default HomeScreen;
