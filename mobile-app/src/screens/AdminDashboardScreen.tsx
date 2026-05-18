import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet
} from 'react-native';
import { theme } from '../constants/theme';
import { fetchAppointments, updateAppointmentStatus } from '../services/supabase';
import { sendConfirmationEmail } from '../services/emailjs';
import { sendSMS } from '../services/sms';
import { logout } from '../hooks/useAuth';
import { Appointment, Stats } from '../types';

interface AdminDashboardScreenProps {
  navigation: any;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('AdminLogin');
  };

  const handleConfirm = async (appointment: Appointment) => {
    Alert.alert(
      'Confirm Appointment',
      `Confirm booking for ${appointment.name}? Email + SMS will be sent.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointment.id, 'confirmed');
              loadAppointments();
              try {
                await sendConfirmationEmail(appointment);
              } catch {
                console.log('[Admin] Email failed, continuing');
              }
              try {
                await sendSMS(appointment.phone, `Yokesh Auto Mobiles: Your booking for ${appointment.service} on ${appointment.appointment_date} is CONFIRMED! See you at our workshop.`);
              } catch {
                console.log('[Admin] SMS failed, continuing');
              }
              Alert.alert('Confirmed', `Appointment confirmed for ${appointment.name}.`);
            } catch {
              Alert.alert('Error', 'Could not update appointment status. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCancel = async (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateAppointmentStatus(id, 'cancelled');
              Alert.alert('Success', 'Appointment cancelled');
              loadAppointments();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      case 'pending': return theme.colors.warning;
      default: return theme.colors.textMuted;
    }
  };
  const getStatusBg = (status: string) => {
    switch (status) {
      case 'confirmed': return '#1b5e20';
      case 'cancelled': return '#b71c1c';
      default: return '#e65100';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Yokesh Auto Mobiles</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.error }]}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>

        {/* Appointments List */}
        <Text style={styles.sectionTitle}>Recent Appointments</Text>

        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No appointments yet</Text>
          </View>
        ) : (
          appointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.customerName}>{apt.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(apt.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                    {apt.status}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <Text style={styles.detailText}>📧 {apt.email}</Text>
                <Text style={styles.detailText}>📱 {apt.phone}</Text>
                <Text style={styles.detailText}>🚗 {apt.vehicle}</Text>
                <Text style={styles.detailText}>🔧 {apt.service}</Text>
                <Text style={styles.detailText}>📅 {formatDate(apt.appointment_date)}</Text>
              </View>

              {apt.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => handleConfirm(apt)}
                  >
                    <Text style={styles.confirmBtnText}>✓ Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancel(apt.id)}
                  >
                    <Text style={styles.cancelBtnText}>✗ Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface
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
  header: {
    backgroundColor: theme.colors.headerBg,
    padding: theme.spacing.lg,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted
  },
  logoutBtn: {
    color: theme.colors.white,
    fontSize: 14,
    padding: theme.spacing.sm
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  statCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  appointmentDetails: {
    marginBottom: theme.spacing.sm
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 2
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: theme.colors.success,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center'
  },
  confirmBtnText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 14
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: theme.colors.error,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center'
  },
  cancelBtnText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 14
  }
});

export default AdminDashboardScreen;