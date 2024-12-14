import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/Screen/RegisterScreen';  // Register Screen import
import LoginScreen from './src/Screen/LoginScreen';  // Login Screen import
import AdminDashboard from './src/Screen/AdminDashboard';
import EmployeeDashboard from './src/Screen/EmployeeDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';  // AsyncStorage import
import LeaveRequestScreen from './src/Screen/LeaveRequestScreen';
import LeaveStatusScreen from './src/Screen/LeaveStatusScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track if the user is logged in
  const [userRole, setUserRole] = useState(null);  // State to store user role (Admin/Employee)

  // Check if user is logged in on app load
  const checkLoginStatus = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUserRole = await AsyncStorage.getItem('role');  // Assuming user role is saved in AsyncStorage

      if (storedUserId && storedUserRole) {
        setIsLoggedIn(true);  // User is logged in
        setUserRole(storedUserRole);  // Set user role (Admin/Employee)
      } else {
        setIsLoggedIn(false);  // User is not logged in
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();  // Check login status when the app starts
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? (userRole === 'admin' ? 'AdminDashboard' : 'EmployeeDashboard') : 'Login'}
        screenOptions={{
          gestureEnabled: false,  // Disables back swipe gesture on screens to prevent back to login page
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
        <Stack.Screen name="LeaveRequestScreen" component={LeaveRequestScreen} />
        <Stack.Screen name="LeaveStatus" component={LeaveStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
