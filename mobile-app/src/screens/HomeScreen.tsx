import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { theme } from '../constants/theme';
import { SERVICES, BUSINESS_INFO } from '../constants/config';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: false })
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: false })
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [logoOpacity, logoScale, pulseAnim]);

  const handleCardPress = (serviceName: string) => {
    setSelectedCard(serviceName);
    setTimeout(() => {
      setSelectedCard(null);
      navigation.navigate('Booking', { service: serviceName });
    }, 200);
  };

  const isSelected = (name: string) => selectedCard === name;

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image source={require('../../assets/car-hero.jpg')} style={styles.heroBgImage} resizeMode="cover" />
        <View style={styles.heroOverlay}>
          <Animated.Image
            source={require('../../assets/logo.png')}
            style={[
              styles.heroLogo,
              { opacity: logoOpacity, transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }] }
            ]}
          />
          <Text style={styles.heroTitle}>Expert Car Care &{'\n'}Water Wash Services</Text>
          <Text style={styles.heroSubtitle}>Professional automotive care in Chennai</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15+</Text>
          <Text style={styles.statLabel}>Years Experience</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
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
              style={[styles.serviceCard, isSelected(service.name) && styles.cardSelected]}
              onPress={() => handleCardPress(service.name)}
            >
              <Text style={[styles.serviceName, isSelected(service.name) && styles.cardTextSelected]}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Water Wash Packages</Text>
        <Image source={require('../../assets/car-wash.jpg')} style={styles.sectionImage} />
        <View style={styles.servicesGrid}>
          {SERVICES.wash.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected(service.name) && styles.cardSelected]}
              onPress={() => handleCardPress(service.name)}
            >
              <Text style={[styles.serviceName, isSelected(service.name) && styles.cardTextSelected]}>{service.name}</Text>
              <Text style={[styles.servicePrice, isSelected(service.name) && styles.cardPriceSelected]}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Maintenance Packages</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.packages.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected(service.name) && styles.cardSelected]}
              onPress={() => handleCardPress(service.name)}
            >
              <Text style={[styles.serviceName, isSelected(service.name) && styles.cardTextSelected]}>{service.name}</Text>
              <Text style={[styles.servicePrice, isSelected(service.name) && styles.cardPriceSelected]}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.aboutText}>
          Yokesh Auto Mobiles is your trusted partner for professional car care and water wash services in Chennai. 
          We specialize in mechanical repairs, engine diagnostics, AC service, and comprehensive maintenance packages 
          to keep your vehicle running at its best.
        </Text>
      </View>

      {/* Contact Section */}
      <Image source={require('../../assets/clean-car.jpg')} style={styles.sectionImage} />
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactName}>{BUSINESS_INFO.name}</Text>
        <Text style={styles.contactLabel}>Phone</Text>
        <Text style={styles.contactValue}>{BUSINESS_INFO.phone}</Text>
        <Text style={styles.contactLabel}>Email</Text>
        <Text style={styles.contactValue}>{BUSINESS_INFO.email}</Text>
        <Text style={styles.contactLabel}>Address</Text>
        <Text style={styles.contactValue}>{BUSINESS_INFO.address}</Text>
        <Text style={styles.contactLabel}>Hours</Text>
        <Text style={styles.contactValue}>{BUSINESS_INFO.hours}</Text>
        <Text style={styles.contactValue}>{BUSINESS_INFO.closedDays} Closed</Text>
      </View>
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
    height: '100%'
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
    marginBottom: theme.spacing.md,
    boxShadow: '0 4px 12px rgba(0, 96, 240, 0.4)'
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
  aboutSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary
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
  cardSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text
  },
  cardTextSelected: {
    color: '#000000'
  },
  servicePrice: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 4
  },
  cardPriceSelected: {
    color: '#000000'
  },
  contactSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: 2
  },
  contactValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4
  }
});

export default HomeScreen;