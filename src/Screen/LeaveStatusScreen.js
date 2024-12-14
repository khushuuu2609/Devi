import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaveStatusScreen = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaveRequests = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Get user ID from storage
      const response = await fetch(`http://10.0.2.2:5000/api/leave/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setLeaves(data); // Store leave requests in state
      } else {
        console.error('Failed to fetch leave requests:', data.error);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Start Date: {item.startDate}</Text>
      <Text style={styles.cardText}>End Date: {item.endDate}</Text>
      <Text style={styles.cardText}>Reason: {item.reason}</Text>
      <Text style={styles.cardText}>Status: {item.leave_status || 'Pending'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Status</Text>
      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default LeaveStatusScreen;
