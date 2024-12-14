import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text>Welcome, Admin! You have full control over the system.</Text>

      {/* You can add admin-specific actions like managing users, viewing reports, etc. */}
      <Button title="Manage Users" onPress={() => { /* Navigate to user management */ }} />
      <Button title="View Reports" onPress={() => { /* Navigate to reports */ }} />
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
});

export default AdminDashboard;
