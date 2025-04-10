// screens/JobDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const JobDetailsScreen = ({ route }) => {
  const { job } = route.params;

  const handleApply = () => {
    if (job.applicationLink) {
      Linking.openURL(job.applicationLink);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{job.description}</Text>
      <Text style={styles.sectionTitle}>Requirements</Text>
      <Text style={styles.requirements}>{job.requirements || 'Not specified'}</Text>
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  company: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  requirements: {
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#4285f4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;