import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../constants/theme';
import { SERVICES, BUSINESS_INFO } from '../constants/config';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image source={require('../../assets/car-hero.jpg')} style={styles.heroBgImage} />
        <View style={styles.heroOverlay}>
          <Image source={require('../../assets/logo.jpeg')} style={styles.heroLogo} />
          <Text style={styles.heroTitle}>Expert Car Care &{'\n'}Water Wash Services</Text>
          <Text style={styles.heroSubtitle}>Professional automotive care in Chennai</Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Booking')}
            >
              <Text style={styles.primaryBtnText}>Our Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Booking')}
            >
              <Text style={styles.secondaryBtnText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1+</Text>
          <Text style={styles.statLabel}>Year Experience</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Cars Serviced</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Customer Satisfaction</Text>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>

        <Image source={require('../../assets/mechanic-workshop.jpg')} style={styles.sectionImage} />

        <Text style={styles.categoryTitle}>Mechanical Services</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.mechanical.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Booking', { service: service.name })}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Water Wash Packages</Text>
        <Image source={require('../../assets/car-wash.jpg')} style={styles.sectionImage} />
        <View style={styles.servicesGrid}>
          {SERVICES.wash.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Booking', { service: service.name })}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Maintenance Packages</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.packages.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Booking', { service: service.name })}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <Image source={require('../../assets/clean-car.jpg')} style={styles.sectionImage} />
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactText}>{BUSINESS_INFO.name}</Text>
        <Text style={styles.contactText}>{BUSINESS_INFO.phone}</Text>
        <Text style={styles.contactText}>{BUSINESS_INFO.email}</Text>
        <Text style={styles.contactText}>{BUSINESS_INFO.address}</Text>
        <Text style={styles.contactText}>{'\n'}{BUSINESS_INFO.hours}</Text>
        <Text style={styles.contactText}>{BUSINESS_INFO.closedDays} Closed</Text>
      </View>

      {/* Book CTA */}
      <TouchableOpacity
        style={styles.bookCta}
        onPress={() => navigation.navigate('Booking')}
      >
        <Text style={styles.bookCtaText}>Book Your Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  hero: {
    height: 480,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: 60
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: theme.spacing.md
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.lg
  },
  heroButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryBtn: {
    backgroundColor: theme.colors.buttonAccent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md
  },
  secondaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  sectionImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg
  },
  section: {
    padding: theme.spacing.lg
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    color: theme.colors.text
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '48%',
    marginBottom: theme.spacing.sm
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text
  },
  servicePrice: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 4
  },
  contactSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4
  },
  bookCta: {
    backgroundColor: theme.colors.buttonAccent,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center'
  },
  bookCtaText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600'
  }
});

export default HomeScreen;