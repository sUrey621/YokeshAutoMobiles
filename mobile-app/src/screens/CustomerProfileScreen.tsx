import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../constants/theme';
import { BUSINESS_INFO } from '../constants/config';
import { Appointment } from '../types';

interface CustomerProfileScreenProps {
  navigation: any;
}

interface CustomerData {
  customer_id: string;
  full_name: string;
  mobile_number: string;
  email_address: string;
  registered_at: string;
  notification_sms: boolean;
  notification_email: boolean;
}

export default function CustomerProfileScreen({ navigation }: CustomerProfileScreenProps) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('user_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        setCustomer({
          customer_id: parsed.customer_id || 'GUEST',
          full_name: parsed.name || 'Guest User',
          mobile_number: parsed.phone || '',
          email_address: parsed.email || '',
          registered_at: parsed.registered_at || new Date().toISOString(),
          notification_sms: true,
          notification_email: true
        });

        // Load bookings if customer_id exists
        if (parsed.customer_id) {
          // In production, fetch from API
          // For demo, bookings will be empty
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user_session');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user_session');
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon.');
  };

  const handleNotificationToggle = async (type: 'sms' | 'email') => {
    if (!customer) return;
    const key = type === 'sms' ? 'notification_sms' : 'notification_email';
    const updatedCustomer = {
      ...customer,
      [key]: !customer[key as keyof CustomerData]
    };
    setCustomer(updatedCustomer as CustomerData);
    await AsyncStorage.setItem('user_session', JSON.stringify(updatedCustomer));
    Alert.alert('Success', `Notification ${type === 'sms' ? 'SMS' : 'Email'} preferences updated.`);
  };

  const getBookingStatus = (status: string) => {
    switch (status) {
      case 'pending': return '🕐 Pending';
      case 'confirmed': return '✅ Confirmed';
      case 'cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Please login to view your profile</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = customer.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.customerName}>{customer.full_name}</Text>
        <Text style={styles.customerId}>ID: {customer.customer_id}</Text>
      </View>

      {/* Personal Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.editBtn}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{customer.full_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile Number</Text>
          <Text style={styles.infoValue}>{customer.mobile_number || 'Not set'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>{customer.email_address || 'Not set'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {new Date(customer.registered_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => handleNotificationToggle('sms')}
        >
          <Text style={styles.toggleLabel}>📱 SMS Notifications</Text>
          <View style={[styles.toggle, customer.notification_sms && styles.toggleActive]}>
            <Text style={styles.toggleText}>
              {customer.notification_sms ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => handleNotificationToggle('email')}
        >
          <Text style={styles.toggleLabel}>📧 Email Notifications</Text>
          <View style={[styles.toggle, customer.notification_email && styles.toggleActive]}>
            <Text style={styles.toggleText}>
              {customer.notification_email ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Booking History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 My Bookings</Text>
          <TouchableOpacity onPress={() => Alert.alert('All Bookings', 'View all bookings coming soon.')}>
            <Text style={styles.viewAllBtn}>View All</Text>
          </TouchableOpacity>
        </View>

        {bookings.length === 0 ? (
          <Text style={styles.noBookings}>No bookings yet. Book your first service!</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingService}>{booking.service}</Text>
                <Text style={styles.bookingStatus}>{getBookingStatus(booking.status)}</Text>
              </View>
              <Text style={styles.bookingDate}>📅 {booking.appointment_date}</Text>
              <Text style={styles.bookingVehicle}>🚗 {booking.vehicle}</Text>
            </View>
          ))
        )}
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
          <Text style={styles.actionBtnText}>🚪 Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnText}>🗑️ Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Shop */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Need Help?</Text>
        <Text style={styles.contactText}>Contact {BUSINESS_INFO.name}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${BUSINESS_INFO.phone}`)}>
          <Text style={styles.contactPhone}>📞 {BUSINESS_INFO.phone}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  notLoggedInText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg
  },
  loginBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md
  },
  loginBtnText: {
    color: theme.colors.white,
    fontWeight: '600'
  },
  header: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.xl,
    paddingTop: 60,
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  customerId: {
    fontSize: 12,
    color: '#999',
    marginTop: theme.spacing.xs
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  editBtn: {
    fontSize: 14,
    color: theme.colors.primary
  },
  viewAllBtn: {
    fontSize: 14,
    color: theme.colors.primary
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500'
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm
  },
  toggleLabel: {
    fontSize: 14,
    color: theme.colors.text
  },
  toggle: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#ddd'
  },
  toggleActive: {
    backgroundColor: theme.colors.success
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white
  },
  noBookings: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg
  },
  bookingCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs
  },
  bookingService: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text
  },
  bookingStatus: {
    fontSize: 12
  },
  bookingDate: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  bookingVehicle: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  actionBtn: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  actionBtnText: {
    fontSize: 14,
    color: theme.colors.text
  },
  deleteBtn: {
    borderBottomWidth: 0
  },
  deleteBtnText: {
    fontSize: 14,
    color: theme.colors.error
  },
  contactSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    alignItems: 'center'
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  contactPhone: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: theme.spacing.sm
  }
});
