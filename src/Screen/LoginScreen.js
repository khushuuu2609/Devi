import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, store user data and navigate
        const { user } = data;

        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userId', user.id);
        await AsyncStorage.setItem('name', user.name);
        await AsyncStorage.setItem('role', user.role);

        // If admin, navigate to Admin Dashboard
        if (user.role === 'admin') {
          Alert.alert('Login Successful', 'Welcome Admin');
          navigation.navigate('AdminDashboard', {
            userId: user.id,
            name: user.name,
          });
        } else {
          // If employee, navigate to Employee Dashboard
          Alert.alert('Login Successful', 'Welcome Employee');
          navigation.navigate('EmployeeDashboard', {
            userId: user.id,
            userName: user.name,
          });
        }
      } else {
        // If login fails
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.registerLink}>
        <Text>Don't have an account? </Text>
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  registerLink: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default LoginScreen;
