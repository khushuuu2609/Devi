import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Default role is 'employee'
  const role = 'employee'; 

  // Function to handle registration
  const handleRegister = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If registration is successful
        Alert.alert('Registration Successful', 'You have been registered successfully');
        navigation.navigate('Login'); // Navigate to login page after successful registration
      } else {
        // If there's an error
        Alert.alert('Registration Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

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

      {/* Remove the role input field since it's hardcoded */}
      {/* <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      /> */}

      <Button title="Register" onPress={handleRegister} />

      <View style={styles.loginLink}>
        <Text>Already have an account? </Text>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
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
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default RegisterScreen;
