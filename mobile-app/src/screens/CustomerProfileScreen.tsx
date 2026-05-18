import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../constants/theme';
import { BUSINESS_INFO } from '../constants/config';
import { Appointment, Customer } from '../types';
import { fetchCustomerBookings } from '../services/supabase';

interface CustomerProfileScreenProps {
  navigation: any;
}

export default function CustomerProfileScreen({ navigation }: CustomerProfileScreenProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('user_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const customerData: Customer = {
          customer_id: parsed.customer_id || 'GUEST',
          full_name: parsed.name || parsed.full_name || 'Guest User',
          mobile_number: parsed.phone || parsed.mobile_number || '',
          email_address: parsed.email || parsed.email_address || '',
          is_verified: parsed.is_verified || false,
          registered_at: parsed.registered_at || new Date().toISOString(),
          last_login_at: parsed.last_login_at || new Date().toISOString(),
          notification_sms: parsed.notification_sms ?? true,
          notification_email: parsed.notification_email ?? true
        };
        setCustomer(customerData);

        if (customerData.email_address) {
          try {
            const bookingsData = await fetchCustomerBookings(customerData.email_address);
            setBookings(bookingsData);
          } catch (err) {
            console.log('No bookings found or failed to fetch');
          }
        }
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
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
            resetToLogin();
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
            resetToLogin();
          }
        }
      ]
    );
  };

  const openEditProfile = () => {
    if (!customer) return;
    setEditName(customer.full_name);
    setEditPhone(customer.mobile_number);
    setEditEmail(customer.email_address);
    setShowEditModal(true);
  };

  const saveProfile = async () => {
    if (!customer) return;
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    const updatedCustomer = {
      ...customer,
      full_name: editName.trim(),
      mobile_number: editPhone.trim(),
      email_address: editEmail.trim()
    };
    setCustomer(updatedCustomer);
    await AsyncStorage.setItem('user_session', JSON.stringify(updatedCustomer));
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleNotificationToggle = async (type: 'sms' | 'email') => {
    if (!customer) return;
    const key = type === 'sms' ? 'notification_sms' : 'notification_email';
    const updatedCustomer = {
      ...customer,
      [key]: !customer[key as keyof Customer]
    };
    setCustomer(updatedCustomer as Customer);
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
          <TouchableOpacity onPress={openEditProfile}>
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

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.modalLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
            />

            <Text style={styles.modalLabel}>Mobile Number</Text>
            <TextInput
              style={styles.modalInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
            />

            <Text style={styles.modalLabel}>Email Address</Text>
            <TextInput
              style={styles.modalInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveProfile}>
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: theme.colors.headerBg,
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
    color: theme.colors.textMuted,
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
    borderBottomColor: theme.colors.border
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
    backgroundColor: theme.colors.surfaceLight
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
    borderBottomColor: theme.colors.border
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    marginBottom: theme.spacing.md
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md
  },
  modalCancelBtn: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md
  },
  modalCancelBtnText: {
    fontSize: 16,
    color: theme.colors.textSecondary
  },
  modalSaveBtn: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md
  },
  modalSaveBtnText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: '600'
  }
});
