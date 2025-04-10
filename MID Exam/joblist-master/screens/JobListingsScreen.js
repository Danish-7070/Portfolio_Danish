import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const JobListingsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs when the screen loads
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Try to load jobs from AsyncStorage first
      const storedJobs = await AsyncStorage.getItem('jobs');
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
        setLoading(false);
      }

      // Fetch from API
      const response = await axios.get('http://localhost:3000/api/jobs');
      const fetchedJobs = response.data;
      setJobs(fetchedJobs);
      setLoading(false);

      // Store in AsyncStorage
      await AsyncStorage.setItem('jobs', JSON.stringify(fetchedJobs));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage and navigate to Login (no Firebase auth to sign out)
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Optional Static Header (no user data from Firebase) */}
      <View style={styles.header}>
        <Text style={styles.userName}>Job Listings</Text>
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>

      {/* Job Listings */}
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
});

export default JobListingsScreen;