import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { theme } from '../constants/theme';
import { SERVICE_OPTIONS } from '../constants/config';
import { createAppointment } from '../services/supabase';
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
    newsletter: false,
    contact_consent: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [loading, setLoading] = useState(false);

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
      await createAppointment({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        vehicle: formData.vehicle.trim(),
        service: formData.service,
        message: formData.message.trim(),
        appointment_date: formData.appointment_date,
        newsletter: formData.newsletter,
        contact_consent: formData.contact_consent
      });

      Alert.alert(
        'Success',
        'Your appointment has been booked! We will contact you shortly.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>Fill the form below and we'll get back to you</Text>
      </View>

      <View style={styles.form}>
        {/* Name */}
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

        {/* Phone */}
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

        {/* Email */}
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

        {/* Vehicle */}
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

        {/* Service */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Required *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll}>
            {SERVICE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.serviceOption,
                  formData.service === option && styles.serviceOptionSelected
                ]}
                onPress={() => setFormData({ ...formData, service: option })}
              >
                <Text
                  style={[
                    styles.serviceOptionText,
                    formData.service === option && styles.serviceOptionTextSelected
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.service && <Text style={styles.errorText}>{errors.service}</Text>}
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Date *</Text>
          <TextInput
            style={[styles.input, errors.appointment_date && styles.inputError]}
            placeholder="YYYY-MM-DD"
            value={formData.appointment_date}
            onChangeText={(text) => setFormData({ ...formData, appointment_date: text })}
          />
          <Text style={styles.hint}>Enter date in YYYY-MM-DD format (e.g., 2026-04-25)</Text>
          {errors.appointment_date && <Text style={styles.errorText}>{errors.appointment_date}</Text>}
        </View>

        {/* Message */}
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

        {/* Newsletter */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setFormData({ ...formData, newsletter: !formData.newsletter })}
        >
          <View style={[styles.checkbox, formData.newsletter && styles.checkboxChecked]}>
            {formData.newsletter && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Subscribe to newsletter for updates</Text>
        </TouchableOpacity>

        {/* Consent */}
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

        {/* Submit */}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.xl,
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
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
    borderColor: '#ddd',
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
  hint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4
  },
  serviceScroll: {
    flexDirection: 'row'
  },
  serviceOption: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  serviceOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  serviceOptionText: {
    fontSize: 12,
    color: theme.colors.text
  },
  serviceOptionTextSelected: {
    color: theme.colors.white
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
    borderColor: '#ddd',
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
  }
});

export default BookingScreen;