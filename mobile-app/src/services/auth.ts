import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { Customer, CustomerSession } from '../types';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_STORAGE_KEY = 'demo_otp';

export async function sendOTP(type: 'sms' | 'email', destination: string): Promise<{ success: boolean; message: string; otp: string }> {
  const otp = generateOTP();

  try {
    // Store OTP in AsyncStorage for demo verification
    await AsyncStorage.setItem(OTP_STORAGE_KEY, otp);
    console.log(`[OTP] ${type.toUpperCase()} OTP for ${destination}: ${otp}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: `OTP sent successfully to your ${type === 'sms' ? 'mobile number' : 'email address'}`,
      otp
    };
  } catch (error) {
    console.error('OTP send error:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.',
      otp: ''
    };
  }
}

// Get the last generated OTP (for demo only - never use in production)
export async function getLastOTP(): Promise<string> {
  return await AsyncStorage.getItem(OTP_STORAGE_KEY) || '';
}

// Verify OTP (demo implementation)
export async function verifyOTP(destination: string, otp: string): Promise<{ success: boolean; message: string }> {
  if (otp.length !== OTP_LENGTH) {
    return { success: false, message: 'Invalid OTP format' };
  }

  // Demo: get the stored OTP from AsyncStorage
  const storedOTP = await AsyncStorage.getItem(OTP_STORAGE_KEY);
  const validOTP = storedOTP || '123456';

  if (otp !== validOTP) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  // Clear the OTP after successful verification
  await AsyncStorage.removeItem(OTP_STORAGE_KEY);

  return { success: true, message: 'OTP verified successfully' };
}

// Register new customer
export async function registerCustomer(
  fullName: string,
  mobileNumber: string,
  emailAddress: string,
  dateOfBirth?: string,
  gender?: string
): Promise<{ success: boolean; customer?: Customer; message: string }> {
  try {
    // Check if mobile or email already exists
    const { data: existing } = await supabase
      .from('customers')
      .select('customer_id')
      .or(`mobile_number.eq.${mobileNumber},email_address.eq.${emailAddress}`)
      .single();

    if (existing) {
      return {
        success: false,
        message: 'An account with this mobile number or email already exists'
      };
    }

    // In production, insert into customers table
    // For demo, simulate registration
    const customer: Customer = {
      customer_id: `CUST_${Date.now()}`,
      full_name: fullName,
      mobile_number: mobileNumber,
      email_address: emailAddress,
      date_of_birth: dateOfBirth,
      gender: gender,
      is_verified: false,
      registered_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      notification_sms: true,
      notification_email: true
    };

    console.log('[AUTH] New customer registered:', customer);

    return {
      success: true,
      customer,
      message: 'Registration successful. Please verify your account.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
}

// Customer login (OTP-based)
export async function loginCustomer(
  identifier: string // mobile number or email
): Promise<{ success: boolean; message: string }> {
  // Check if customer exists
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .or(`mobile_number.eq.${identifier},email_address.eq.${identifier}`)
    .single();

  if (!customer) {
    return {
      success: false,
      message: 'No account found with this mobile number or email'
    };
  }

  return {
    success: true,
    message: 'OTP sent successfully'
  };
}

// Get customer session from local storage
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  return session?.user ? {
    customer_id: session.user.id,
    full_name: session.user.user_metadata?.full_name || '',
    mobile_number: session.user.user_metadata?.mobile_number || '',
    email_address: session.user.email || '',
    is_verified: true,
    created_at: session.user.created_at
  } : null;
}

// Update customer profile
export async function updateCustomerProfile(
  customerId: string,
  updates: Partial<Customer>
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('customer_id', customerId);

    if (error) throw error;

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

// Fetch customer by ID
export async function fetchCustomer(customerId: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_id', customerId)
    .single();

  if (error) return null;
  return data;
}

// Delete customer account
export async function deleteCustomerAccount(
  customerId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customer_id', customerId);

    if (error) throw error;

    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Account deletion error:', error);
    return { success: false, message: 'Failed to delete account' };
  }
}
