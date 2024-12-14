import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminDashboard from '../Screen/AdminDashboard';
import EmployeeDashboard from '../Screen/EmployeeDashboard';
import LeaveRequestScreen from '../Screen/LeaveRequestScreen';
import LeaveStatusScreen from '../Screen/LeaveStatusScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />.
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
      <Stack.Screen name="LeaveRequestScreen" component={LeaveRequestScreen} />
      <Stack.Screen name="LeaveStatus" component={LeaveStatusScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
