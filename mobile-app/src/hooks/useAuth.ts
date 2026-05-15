import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN_CREDENTIALS } from '../constants/config';

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

export async function checkAuth(): Promise<boolean> {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    if (!session) return false;

    const parsed = JSON.parse(session);
    if (typeof parsed !== 'object' || parsed === null) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return false;
    }

    const expiresAt = parsed.expiresAt;
    if (typeof expiresAt !== 'number' || Date.now() < expiresAt) {
      return true;
    }

    await AsyncStorage.removeItem(SESSION_KEY);
    return false;
  } catch {
    return false;
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const session: AdminSession = {
      isAuthenticated: true,
      loginTime: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}