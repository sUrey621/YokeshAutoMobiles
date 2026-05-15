import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../constants/theme';
import { verifyOTP, sendOTP, getLastOTP } from '../services/auth';

interface OTPScreenParams {
  navigation: any;
  route: {
    params: {
      destination: string;
      destinationType: 'sms' | 'email';
      mode: 'register' | 'login';
      fullName?: string;
      mobileNumber?: string;
      emailAddress?: string;
    };
  };
}

export default function OTPScreen({ navigation, route }: any) {
  const { destination, destinationType, mode, fullName, mobileNumber, emailAddress } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [displayedOTP, setDisplayedOTP] = useState<string>('');

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Load and display the stored OTP when screen loads
    getLastOTP().then(storedOTP => {
      setDisplayedOTP(storedOTP || '123456');
    });

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const result = await sendOTP(destinationType, destination);
      if (result.success) {
        Alert.alert('OTP Sent', `A new OTP has been sent to your ${destinationType === 'sms' ? 'mobile' : 'email'}.`);
        setResendTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const fullOtp = otpValue || otp.join('');

    if (fullOtp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= 3) {
      Alert.alert(
        'Too Many Attempts',
        'You have exceeded the maximum number of attempts. Please try again after 15 minutes.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(destination, fullOtp);

      if (result.success) {
        if (mode === 'register') {
          // Save customer session
          const sessionData = {
            customer_id: `CUST_${Date.now()}`,
            name: fullName,
            full_name: fullName,
            email: emailAddress,
            email_address: emailAddress,
            phone: mobileNumber,
            mobile_number: mobileNumber,
            registered_at: new Date().toISOString(),
            is_verified: true
          };
          await AsyncStorage.setItem('user_session', JSON.stringify(sessionData));
        }

        Alert.alert(
          'Success',
          mode === 'register' ? 'Your account has been verified!' : 'Login successful!',
          [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] }) }]
        );
      } else {
        setAttempts(prev => prev + 1);
        Alert.alert('Error', `${result.message} (${3 - attempts - 1} attempts remaining)`);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDestination = () => {
    navigation.goBack();
  };

  const maskedDestination = destinationType === 'sms'
    ? `+91-${destination.slice(-4).padStart(destination.length - 3, '*')}`
    : destination.slice(0, 3) + '***' + destination.slice(-4) + '@' + destination.split('@')[1];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          OTP sent to {destinationType === 'sms' ? `+91 **** ${destination.slice(-4)}` : maskedDestination}
        </Text>
      </View>

      <View style={styles.form}>
        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, otp[index] && styles.otpInputFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={value => handleOTPChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timerText}>
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'OTP expired'}
        </Text>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
          onPress={() => handleVerify()}
          disabled={loading}
        >
          <Text style={styles.verifyBtnText}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </TouchableOpacity>

        {/* Resend Link */}
        <TouchableOpacity
          style={[styles.resendBtn, !canResend && styles.resendBtnDisabled]}
          onPress={handleResend}
          disabled={!canResend || loading}
        >
          <Text style={[styles.resendBtnText, !canResend && styles.resendBtnTextDisabled]}>
            Resend OTP
          </Text>
        </TouchableOpacity>

        {/* Change Destination */}
        <TouchableOpacity style={styles.changeBtn} onPress={handleChangeDestination}>
          <Text style={styles.changeBtnText}>Change {destinationType === 'sms' ? 'Mobile Number' : 'Email'}</Text>
        </TouchableOpacity>
      </View>

      {/* Demo Note */}
      <View style={styles.demoNote}>
        <Text style={styles.demoNoteText}>📌 Demo Mode: Your OTP is <Text style={styles.demoOtp}>{displayedOTP}</Text></Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.xl,
    paddingTop: 80,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: theme.spacing.sm,
    textAlign: 'center'
  },
  form: {
    padding: theme.spacing.xl,
    alignItems: 'center'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.xl
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: theme.borderRadius.md,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: theme.colors.surface
  },
  otpInputFilled: {
    borderColor: theme.colors.primary
  },
  timerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg
  },
  verifyBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl * 2,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    alignItems: 'center'
  },
  verifyBtnDisabled: {
    opacity: 0.6
  },
  verifyBtnText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600'
  },
  resendBtn: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md
  },
  resendBtnDisabled: {
    opacity: 0.5
  },
  resendBtnText: {
    color: theme.colors.primary,
    fontSize: 16
  },
  resendBtnTextDisabled: {
    color: theme.colors.textSecondary
  },
  changeBtn: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md
  },
  changeBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 14
  },
  demoNote: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: 'auto',
    marginBottom: theme.spacing.xl
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
