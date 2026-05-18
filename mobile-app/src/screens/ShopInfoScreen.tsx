import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native';
import { theme } from '../constants/theme';
import { BUSINESS_INFO } from '../constants/config';

interface ShopInfoScreenProps {
  navigation: any;
}

export default function ShopInfoScreen({ navigation }: ShopInfoScreenProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${BUSINESS_INFO.phone}`);
  };

  const handleWhatsApp = () => {
    const waNumber = BUSINESS_INFO.phone.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${waNumber}?text=Hi, I'm interested in your services`);
  };

  const handleDirections = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.mapsCoords}&destination_place_id=Yokesh+Auto+Mobiles`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.shopName}>{BUSINESS_INFO.name}</Text>
        <Text style={styles.tagline}>Expert Car Care & Water Wash Services</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Text style={styles.callBtnIcon}>📞</Text>
          <Text style={styles.callBtnText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Text style={styles.whatsappBtnIcon}>💬</Text>
          <Text style={styles.whatsappBtnText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.sectionText}>
          Yokesh Auto Mobiles is a professional automotive care center offering
          expert car maintenance and water wash services in Chennai. With years of
          experience, we provide quality service for all your vehicle needs.
        </Text>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <Text style={styles.sectionText}>
          • Oil Change & Filter{'\n'}
          • Brake Repair & Service{'\n'}
          • Engine Diagnostics{'\n'}
          • Transmission Service{'\n'}
          • Suspension & Steering{'\n'}
          • Battery & Electrical{'\n'}
          • AC Service & Repair{'\n'}
          • Tire Services{'\n'}
          • General Repair{'\n'}
          • Express Wash, Deluxe Wash, Premium Detail{'\n'}
          • Annual Maintenance Packages
        </Text>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactText}>{BUSINESS_INFO.address}</Text>
        </View>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactText}>{BUSINESS_INFO.phone}</Text>
        </View>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>✉️</Text>
          <Text style={styles.contactText}>{BUSINESS_INFO.email}</Text>
        </View>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>🕐</Text>
          <Text style={styles.contactText}>
            {BUSINESS_INFO.hours}{'\n'}{BUSINESS_INFO.closedDays} Closed
          </Text>
        </View>
      </View>

      {/* Get Directions */}
      <TouchableOpacity style={styles.directionsBtn} onPress={handleDirections}>
        <Text style={styles.directionsBtnText}>📍 Get Directions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.headerBg,
    padding: theme.spacing.xl,
    paddingTop: 60,
    alignItems: 'center'
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm
  },
  quickActions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callBtnIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm
  },
  callBtnText: {
    color: theme.colors.white,
    fontWeight: '600'
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#25D366',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  whatsappBtnIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm
  },
  whatsappBtnText: {
    color: theme.colors.white,
    fontWeight: '600'
  },
  section: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md
  },
  contactIcon: {
    fontSize: 18,
    marginRight: theme.spacing.md
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1
  },
  directionsBtn: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center'
  },
  directionsBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600'
  }
});
