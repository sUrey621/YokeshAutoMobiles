import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_LENGTH = 6;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_STORAGE_KEY = 'demo_otp';
const OTP_DEST_KEY = 'demo_otp_dest';

export async function sendOTP(type: 'sms' | 'email', destination: string): Promise<{ success: boolean; message: string; otp: string }> {
  const otp = generateOTP();

  try {
    await AsyncStorage.multiSet([[OTP_STORAGE_KEY, otp], [OTP_DEST_KEY, destination]]);
    console.log(`[OTP] ${type.toUpperCase()} OTP for ${destination}: ${otp}`);
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

export async function getLastOTP(): Promise<string> {
  return await AsyncStorage.getItem(OTP_STORAGE_KEY) || '';
}

export async function verifyOTP(destination: string, otp: string): Promise<{ success: boolean; message: string }> {
  if (otp.length !== OTP_LENGTH) {
    return { success: false, message: 'Invalid OTP format' };
  }

  const [[, storedOTP], [, storedDest]] = await AsyncStorage.multiGet([OTP_STORAGE_KEY, OTP_DEST_KEY]);
  const validOTP = storedOTP || '123456';

  if (otp !== validOTP) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  if (destination !== storedDest) {
    return { success: false, message: 'OTP does not match this destination.' };
  }

  await AsyncStorage.multiRemove([OTP_STORAGE_KEY, OTP_DEST_KEY]);
  return { success: true, message: 'OTP verified successfully' };
}
