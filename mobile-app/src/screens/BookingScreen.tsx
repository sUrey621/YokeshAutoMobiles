import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Platform
} from 'react-native';
import { theme } from '../constants/theme';
import { SERVICE_OPTIONS, BUSINESS_INFO } from '../constants/config';
import { createAppointment } from '../services/supabase';
import { sendBookingConfirmation, sendAdminNotification } from '../services/emailjs';
import { sendSMS } from '../services/sms';
import { BookingFormData } from '../types';

interface BookingScreenProps {
  navigation: any;
  route: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation, route }) => {
  const initialService = route.params?.service || '';

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    service: initialService,
    message: '',
    appointment_date: '',
    newsletter: true,
    contact_consent: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayStr();

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(p => p - 1);
    } else {
      setPickerMonth(p => p - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(p => p + 1);
    } else {
      setPickerMonth(p => p + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const mm = String(pickerMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const selected = `${pickerYear}-${mm}-${dd}`;
    if (selected < todayStr) return;
    setFormData({ ...formData, appointment_date: selected });
    setShowDatePicker(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(pickerMonth, pickerYear);
    const firstDay = getFirstDayOfMonth(pickerMonth, pickerYear);
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calDay} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(pickerMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${pickerYear}-${mm}-${dd}`;
      const isPast = dateStr < todayStr;
      const isSelected = dateStr === formData.appointment_date;

      cells.push(
        <TouchableOpacity
          key={d}
          style={[styles.calDay, isPast && styles.calDayDisabled, isSelected && styles.calDaySelected]}
          onPress={() => !isPast && handleSelectDate(d)}
          disabled={isPast}
        >
          <Text style={[styles.calDayText, isPast && styles.calDayTextDisabled, isSelected && styles.calDayTextSelected]}>
            {d}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    if (!formData.vehicle.trim()) {
      newErrors.vehicle = 'Vehicle details required';
    }

    if (!formData.service) {
      newErrors.service = 'Select a service';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Select appointment date';
    }

    if (!formData.contact_consent) {
      newErrors.contact_consent = 'You must agree to be contacted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        vehicle: formData.vehicle.trim(),
        service: formData.service,
        message: formData.message.trim(),
        appointment_date: formData.appointment_date,
        newsletter: formData.newsletter
      };

      const appointment = await createAppointment(appointmentData);

      const resetToHome = () => {
        const parent = navigation.getParent();
        if (parent) {
          parent.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
        }
      };

      Promise.allSettled([
        sendBookingConfirmation(appointment),
        sendAdminNotification(appointment),
        formData.phone ? sendSMS(formData.phone, `Yokesh Auto Mobiles: Your booking for ${formData.service} on ${formData.appointment_date} is received. We will confirm shortly.`) : Promise.resolve()
      ]).catch(() => {});

      Alert.alert(
        'Success',
        'Your appointment has been booked! We will contact you shortly.',
        [{ text: 'OK', onPress: resetToHome }]
      );
    } catch (error: any) {
      const msg = error?.message || 'Failed to book appointment. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>Fill the form below and we'll get back to you</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Enter 10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Details *</Text>
          <TextInput
            style={[styles.input, errors.vehicle && styles.inputError]}
            placeholder="e.g., 2020 Toyota Camry"
            value={formData.vehicle}
            onChangeText={(text) => setFormData({ ...formData, vehicle: text })}
          />
          {errors.vehicle && <Text style={styles.errorText}>{errors.vehicle}</Text>}
        </View>

        {/* Service Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Required *</Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerBtn, errors.service && styles.inputError]}
            onPress={() => setShowServicePicker(true)}
          >
            <Text style={[styles.pickerText, !formData.service && styles.pickerPlaceholder]}>
              {formData.service || 'Select a service...'}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {errors.service && <Text style={styles.errorText}>{errors.service}</Text>}
        </View>

        {/* Date Picker Button */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Date *</Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerBtn, errors.appointment_date && styles.inputError]}
            onPress={() => {
              if (formData.appointment_date) {
                const d = new Date(formData.appointment_date + 'T00:00:00');
                setPickerMonth(d.getMonth());
                setPickerYear(d.getFullYear());
              }
              setShowDatePicker(true);
            }}
          >
            <Text style={[styles.pickerText, !formData.appointment_date && styles.pickerPlaceholder]}>
              {formData.appointment_date ? formatDisplayDate(formData.appointment_date) : 'Select date...'}
            </Text>
            <Text style={styles.pickerArrow}>📅</Text>
          </TouchableOpacity>
          {errors.appointment_date && <Text style={styles.errorText}>{errors.appointment_date}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any specific requirements or messages..."
            multiline
            numberOfLines={4}
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setFormData({ ...formData, newsletter: !formData.newsletter })}
        >
          <View style={[styles.checkbox, formData.newsletter && styles.checkboxChecked]}>
            {formData.newsletter && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Subscribe to newsletter for updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setFormData({ ...formData, contact_consent: !formData.contact_consent })}
        >
          <View style={[styles.checkbox, formData.contact_consent && styles.checkboxChecked]}>
            {formData.contact_consent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I agree to be contacted regarding my inquiry *</Text>
        </TouchableOpacity>
        {errors.contact_consent && <Text style={styles.errorText}>{errors.contact_consent}</Text>}

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDatePicker(false)}>
          <View style={styles.datePickerModal}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <View style={styles.calHeader}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <Text style={styles.calNav}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.calMonthYear}>{MONTHS[pickerMonth]} {pickerYear}</Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <Text style={styles.calNav}>▶</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calWeekRow}>
              {DAYS.map(d => <Text key={d} style={styles.calWeekDay}>{d}</Text>)}
            </View>
            <View style={styles.calGrid}>
              {renderCalendar()}
            </View>
            <TouchableOpacity style={styles.calDoneBtn} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.calDoneText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Service Picker Modal */}
      <Modal visible={showServicePicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowServicePicker(false)}>
          <View style={styles.servicePickerModal}>
            <View style={styles.servicePickerHeader}>
              <Text style={styles.servicePickerTitle}>Select Service</Text>
              <TouchableOpacity onPress={() => setShowServicePicker(false)}>
                <Text style={styles.servicePickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {SERVICE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.servicePickerItem, formData.service === option && styles.servicePickerItemSelected]}
                  onPress={() => {
                    setFormData({ ...formData, service: option });
                    setShowServicePicker(false);
                  }}
                >
                  <Text style={[styles.servicePickerItemText, formData.service === option && styles.servicePickerItemTextSelected]}>
                    {option}
                  </Text>
                  {formData.service === option && <Text style={styles.servicePickerCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.headerBg,
    padding: theme.spacing.xl,
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm
  },
  form: {
    padding: theme.spacing.lg
  },
  inputGroup: {
    marginBottom: theme.spacing.lg
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.surface
  },
  inputError: {
    borderColor: theme.colors.error
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pickerText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1
  },
  pickerPlaceholder: {
    color: theme.colors.textMuted
  },
  pickerArrow: {
    fontSize: 16,
    marginLeft: 8
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  checkmark: {
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  checkboxLabel: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.lg
  },
  submitBtnDisabled: {
    opacity: 0.6
  },
  submitBtnText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  datePickerModal: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '85%',
    maxWidth: 340
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  calNav: {
    fontSize: 20,
    color: theme.colors.primary,
    padding: theme.spacing.sm
  },
  calMonthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm
  },
  calWeekDay: {
    width: '14%',
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600'
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  calDay: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm
  },
  calDayDisabled: {
    opacity: 0.3
  },
  calDaySelected: {
    backgroundColor: theme.colors.primary
  },
  calDayText: {
    fontSize: 14,
    color: theme.colors.text
  },
  calDayTextDisabled: {
    color: theme.colors.textSecondary
  },
  calDayTextSelected: {
    color: theme.colors.white,
    fontWeight: '600'
  },
  calDoneBtn: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm
  },
  calDoneText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600'
  },
  servicePickerModal: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '85%',
    maxWidth: 340,
    maxHeight: '70%'
  },
  servicePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  servicePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  servicePickerClose: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    padding: theme.spacing.sm
  },
  servicePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  servicePickerItemSelected: {
    backgroundColor: theme.colors.surfaceLight
  },
  servicePickerItemText: {
    fontSize: 15,
    color: theme.colors.text,
    flex: 1
  },
  servicePickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600'
  },
  servicePickerCheck: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
});

export default BookingScreen;
