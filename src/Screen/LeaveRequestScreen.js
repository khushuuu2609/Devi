import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const LeaveRequestScreen = () => {
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !startDate || !endDate || !reason) {
      setMessage('All fields are required');
      return;
    }

    const leaveData = {
      userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
    };

    try {
      const response = await fetch('/api/leave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Leave applied successfully');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Leave Request</h2>
      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>User ID</label>
          <input
            style={styles.input}
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select start date"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select end date"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Reason</label>
          <textarea
            style={styles.textarea}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '100px',
  },
  button: {
    padding: '10px',
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  message: {
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
};

export default LeaveRequestScreen;
