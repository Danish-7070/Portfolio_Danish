import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '113536165514-e901nftphce2e7gl9qri6rq9mm0rehih.apps.googleusercontent.com',
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      const userData = {
        name: user.displayName || 'Unknown',
        email: user.email || 'No email',
        photoUrl: user.photoURL || null,
      };

      const backendUrl = 'http://localhost:3000/api/users';
      await axios.post(backendUrl, userData);

      navigation.replace('JobListings');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Listings</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity
        style={[styles.googleButton, loading && styles.disabledButton]}
        onPress={onGoogleButtonPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#a1c2fa',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;