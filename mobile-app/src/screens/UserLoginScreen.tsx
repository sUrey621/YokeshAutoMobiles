import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { theme } from '../constants/theme';
import { sendOTP } from '../services/auth';

interface UserLoginScreenProps {
  navigation: any;
}

type AuthMode = 'login' | 'register';

export default function UserLoginScreen({ navigation }: UserLoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register' && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile';
    }

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.emailAddress = 'Enter valid email';
    }

    if (mode === 'register' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Determine destination
      const destination = loginMethod === 'phone' ? mobileNumber : emailAddress;
      const destinationType = loginMethod === 'phone' ? 'sms' : 'email';

      // Send OTP
      const result = await sendOTP(destinationType, destination);

      if (result.success) {
        // Show OTP in alert for demo (in production, don't do this!)
        Alert.alert(
          'Demo OTP',
          `Your OTP is: ${result.otp}\n\n(In production, this would be sent to your ${destinationType === 'sms' ? 'mobile' : 'email'})`,
          [{ text: 'OK', onPress: () => navigation.navigate('OTP', {
            destination,
            destinationType,
            mode,
            fullName: mode === 'register' ? fullName : undefined,
            mobileNumber: mode === 'register' ? mobileNumber : undefined,
            emailAddress: mode === 'register' ? emailAddress : undefined
          }) }]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'login'
              ? 'Sign in to book appointments and manage your vehicle'
              : 'Register to get started with our services'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Login Method Toggle (for login) */}
          {mode === 'login' && (
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, loginMethod === 'phone' && styles.toggleBtnActive]}
                onPress={() => setLoginMethod('phone')}
              >
                <Text style={[styles.toggleBtnText, loginMethod === 'phone' && styles.toggleBtnTextActive]}>
                  📱 Phone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, loginMethod === 'email' && styles.toggleBtnActive]}
                onPress={() => setLoginMethod('email')}
              >
                <Text style={[styles.toggleBtnText, loginMethod === 'email' && styles.toggleBtnTextActive]}>
                  📧 Email
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Full Name (Register only) */}
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>
          )}

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {loginMethod === 'phone' || mode === 'register' ? 'Mobile Number *' : 'Mobile Number'}
            </Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.phoneInput,
                  errors.mobileNumber && styles.inputError
                ]}
                placeholder="Enter 10-digit mobile"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>
            {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {loginMethod === 'email' || mode === 'register' ? 'Email Address *' : 'Email Address'}
            </Text>
            <TextInput
              style={[styles.input, errors.emailAddress && styles.inputError]}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
            {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress}</Text>}
          </View>

          {/* Password (Register only) */}
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Create password (min 6 chars)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'Sending OTP...' : mode === 'login' ? 'Send OTP' : 'Register & Verify'}
            </Text>
          </TouchableOpacity>

          {/* Switch Mode */}
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            <Text style={styles.switchBtnText}>
              {mode === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Demo Note */}
          <View style={styles.demoNote}>
            <Text style={styles.demoNoteText}>
              📌 Demo Mode: OTP will be shown in a popup after clicking Send OTP
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  header: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.xl,
    paddingTop: 60
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: theme.spacing.sm
  },
  form: {
    padding: theme.spacing.lg,
    flex: 1
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.lg
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.primary
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary
  },
  toggleBtnTextActive: {
    color: theme.colors.white
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  countryCode: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  phoneInput: {
    flex: 1
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md
  },
  submitBtnDisabled: {
    opacity: 0.6
  },
  submitBtnText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600'
  },
  switchBtn: {
    alignItems: 'center',
    marginTop: theme.spacing.lg
  },
  switchBtnText: {
    color: theme.colors.primary,
    fontSize: 14
  },
  demoNote: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl
  },
  demoNoteText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center'
  },
  demoOtp: {
    fontWeight: 'bold',
    color: theme.colors.primary
  }
});
