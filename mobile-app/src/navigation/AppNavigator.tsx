import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import AccountScreen from '../screens/AccountScreen';
import UserLoginScreen from '../screens/UserLoginScreen';
import ShopInfoScreen from '../screens/ShopInfoScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Loading screen while checking auth
function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.loadingContent, { opacity: fadeAnim }]}>
        <Image source={require('../../assets/logo.png')} style={styles.loadingLogo} />
        <Text style={styles.loadingTitle}>Yokesh Auto Mobiles</Text>
        <Text style={styles.loadingTagline}>Expert Car Care & Water Wash Services</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingSpinner} />
      </Animated.View>
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
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
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
        component={AccountScreen}
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
      <Stack.Screen name="Profile" component={CustomerProfileScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.topBarLogo} />
          <Text style={styles.topBarText}>Yokesh Auto Mobiles</Text>
        </View>
      </View>
      <CustomerStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary
  },
  loadingContent: {
    alignItems: 'center'
  },
  loadingLogo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: theme.spacing.lg
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs
  },
  loadingTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  loadingSpinner: {
    marginTop: theme.spacing.md
  },
  topBar: {
    backgroundColor: theme.colors.headerBg,
    padding: theme.spacing.md,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  topBarLogo: {
    width: 32,
    height: 32,
    borderRadius: 6
  },
  topBarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
});
