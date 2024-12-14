import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeDashboard = ({ navigation }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Track check-in status
  const [checkInTime, setCheckInTime] = useState(null); // Store check-in time
  const [checkOutTime, setCheckOutTime] = useState(null); // Store check-out time
  const [totalWorkingDays, setTotalWorkingDays] = useState(0); // Track total working days
  const [workingHours, setWorkingHours] = useState(0); // Track total working hours
  const [userId, setUserId] = useState(null); // Store the userId
  const [userName, setUserName] = useState(''); // Store the user's name
  const [profilePic, setProfilePic] = useState(''); // Store the user's profile picture URL
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Store all attendance records
  const [leaveRecords, setLeaveRecords] = useState([]); // Store leave records
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Store the current month

  // Fetch user data from AsyncStorage
  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUserName = await AsyncStorage.getItem('name');
      const storedProfilePic = await AsyncStorage.getItem('profilePic');
      
      if (storedUserId) {
        setUserId(storedUserId);
        fetchAttendanceStatus(storedUserId);
        fetchLeaveRecords(storedUserId); // Fetch leave records
      }
      
      if (storedUserName) {
        setUserName(storedUserName);
      }
      
      if (storedProfilePic) {
        setProfilePic(storedProfilePic);
      }
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch attendance status for today and all records
  const fetchAttendanceStatus = async (userId) => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/attendance/user/${userId}`);
      const attendanceData = response.data;

      // Filter records to only include those from the current month
      const filteredRecords = attendanceData.filter((attendance) => {
        const attendanceMonth = new Date(attendance.date).getMonth();
        return attendanceMonth === currentMonth;
      });

      // Check today's attendance
      const todayDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const todayAttendance = filteredRecords.find((attendance) => attendance.date === todayDate);

      if (todayAttendance) {
        setIsCheckedIn(!!todayAttendance.checkIn && !todayAttendance.checkOut);
        setCheckInTime(todayAttendance.checkIn || null);
        setCheckOutTime(todayAttendance.checkOut || null);
        setWorkingHours(todayAttendance.workingHours ? parseFloat(todayAttendance.workingHours).toFixed(2) : null);
      } else {
        setIsCheckedIn(false);
        setCheckInTime(null);
        setCheckOutTime(null);
        setWorkingHours(null);
      }

      // Calculate total working days and total working hours for the current month
      let workingDaysCount = 0;
      let totalHours = 0;

      filteredRecords.forEach((attendance) => {
        if (attendance.checkIn && attendance.checkOut) {
          workingDaysCount += 1;
          totalHours += parseFloat(attendance.workingHours) || 0;
        }
      });

      setTotalWorkingDays(workingDaysCount);
      setWorkingHours(totalHours.toFixed(2)); // Round to 2 decimal places

      // Set all filtered attendance records
      setAttendanceRecords(filteredRecords);
    } catch (error) {
      console.error('Error fetching attendance status:', error.message);
      Alert.alert('Error', 'Failed to fetch attendance status. Please try again later.');
    }
  };

  // Fetch leave records for the user
  const fetchLeaveRecords = async (userId) => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/leave/user/${userId}`);
      setLeaveRecords(response.data);
    } catch (error) {
      console.error('Error fetching leave records:', error.message);
      Alert.alert('Error', 'Failed to fetch leave records. Please try again later.');
    }
  };

  // Format time from ISO string
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle Check-In/Check-Out logic
  const handleCheckInOut = async () => {
    try {
      if (!userId) {
        alert('User ID not found. Please log in.');
        return;
      }

      if (isCheckedIn) {
        // Handle Check-Out
        await axios.post('http://10.0.2.2:5000/api/attendance/check-out', { userId });
        setCheckOutTime(new Date().toLocaleTimeString());
        setIsCheckedIn(false);
        Alert.alert('Success', 'Checked out successfully!');
      } else {
        // Handle Check-In
        await axios.post('http://10.0.2.2:5000/api/attendance/check-in', { userId });
        setCheckInTime(new Date().toLocaleTimeString());
        setIsCheckedIn(true);
        Alert.alert('Success', 'Checked in successfully!');
      }
    } catch (error) {
      console.error('Error during check-in/out:', error.message);
      Alert.alert('Error', 'Already Done.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('profilePic');
      navigation.navigate('Login'); // Navigate to the Login screen after logout
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profilePicContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicFallback}>
              <Text style={styles.profilePicText}>{userName[0]}</Text>
            </View>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.workingDaysText}>Working Days: {totalWorkingDays}</Text>
        </View>

        <View style={styles.checkInSection}>
          <View style={styles.buttonContainer}>
            <Button
              title={isCheckedIn ? 'Check Out' : 'Check In'}
              color={isCheckedIn ? 'green' : 'red'}
              onPress={handleCheckInOut}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Logout" color="blue" onPress={handleLogout} />
          </View>
        </View>
      </View>

      {/* Attendance Report in Tabular Form */}
      <ScrollView style={styles.attendanceReport}>
        <Text style={styles.sectionTitle}>Attendance Report</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Check-In Time</Text>
            <Text style={styles.tableHeader}>Check-Out Time</Text>
            <Text style={styles.tableHeader}>Working Hours</Text>
          </View>
          {attendanceRecords.map((attendance, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableData}>{attendance.date}</Text>
              <Text style={styles.tableData}>{formatTime(attendance.checkIn)}</Text>
              <Text style={styles.tableData}>{formatTime(attendance.checkOut)}</Text>
              <Text style={styles.tableData}>
                {attendance.workingHours ? parseFloat(attendance.workingHours).toFixed(2) : 'N/A'}
              </Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>Total</Text>
            <Text style={styles.tableData}></Text>
            <Text style={styles.tableData}></Text>
            <Text style={styles.tableData}>{workingHours || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Leave Report Section */}
      <ScrollView style={styles.leaveReport}>
        <View style={styles.leaveReportHeader}>
          <Text style={styles.sectionTitle}>Leave Report</Text>  
          <Button 
            title="Apply Leave" 
            color="orange" 
            onPress={() => navigation.navigate('LeaveRequestScreen')} 
            style={styles.leaveButton}
          />
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Start Date</Text>
            <Text style={styles.tableHeader}>End Date</Text>
            <Text style={styles.tableHeader}>Leave Reason</Text>
            <Text style={styles.tableHeader}>Status</Text>
          </View>
          {leaveRecords.map((leave, index) => (
            <View key={index} style={styles.tableRow}>
              {/* Format the startDate and endDate */}
              <Text style={styles.tableData}>
                {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.tableData}>
                {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.tableData}>{leave.reason}</Text>
              <Text style={styles.tableData}>{leave.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePicContainer: {
    flex: 1,
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profilePicFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    color: '#fff',
    fontSize: 24,
  },
  profileInfo: {
    flex: 3,
    paddingLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workingDaysText: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
  checkInSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: ' 80%',
    marginBottom: 10,
  },
  attendanceReport: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  leaveReport: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  leaveReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
  },
  tableData: {
    flex: 1,
  },
  leaveRecord: {
    marginBottom: 10,
  },
  leaveText: {
    fontSize: 16,
  },
});

export default EmployeeDashboard;
