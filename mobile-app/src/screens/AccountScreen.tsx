import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../constants/theme';
import UserLoginScreen from './UserLoginScreen';
import CustomerProfileScreen from './CustomerProfileScreen';

export default function AccountScreen({ navigation }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, [])
  );

  const checkLogin = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      setIsLoggedIn(!!session);
    } catch {
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isLoggedIn) {
    return <CustomerProfileScreen navigation={navigation} />;
  }

  return <UserLoginScreen navigation={navigation} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
