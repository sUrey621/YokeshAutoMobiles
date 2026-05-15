import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import UserLoginScreen from '../screens/UserLoginScreen';
import ShopInfoScreen from '../screens/ShopInfoScreen';
import OTPScreen from '../screens/OTPScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { checkAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Loading screen while checking auth
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Customer Tab Navigator
function CustomerTabs() {
  return (
    <Tab.Navigator
      id="CustomerTabNavigator"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: '#eee',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        },
        headerShown: false
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>
        }}
      />
      <Tab.Screen
        name="BookingTab"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Book',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>
        }}
      />
      <Tab.Screen
        name="LocationTab"
        component={ShopInfoScreen}
        options={{
          tabBarLabel: 'Location',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📍</Text>
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={UserLoginScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>
        }}
      />
    </Tab.Navigator>
  );
}

// Customer Stack - includes all customer-facing screens
function CustomerStack() {
  return (
    <Stack.Navigator id="CustomerStackNavigator" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Login" component={UserLoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Profile" component={CustomerProfileScreen} />
    </Stack.Navigator>
  );
}

// Admin Stack
function AdminStack() {
  return (
    <Stack.Navigator id="AdminStackNavigator" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    checkAuth().then(setIsAuthenticated);
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AdminStack />
      ) : showAdmin ? (
        <AdminStack />
      ) : (
        <>
          <View style={styles.topBar}>
            <Text style={styles.topBarText}>Yokesh Auto Mobiles</Text>
            <Text
              style={styles.adminLink}
              onPress={() => setShowAdmin(true)}
            >
              Admin
            </Text>
          </View>
          <CustomerStack />
        </>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary
  },
  topBar: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topBarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  adminLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600'
  }
});
