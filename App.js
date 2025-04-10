// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'd24ad5659c60bcab7b6c9192f28ee548';
  const CITY = 'Islamabad';

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.weatherCard}>
          <Text style={styles.city}>{CITY}</Text>
          <Text style={styles.temp}>
            {Math.round(weatherData.main.temp)}°C
          </Text>
          <Text style={styles.description}>
            {weatherData.weather[0].description}
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>
              Humidity: {weatherData.main.humidity}%
            </Text>
            <Text style={styles.detailText}>
              Wind: {weatherData.wind.speed} m/s
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  city: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  details: {
    width: '100%',
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginVertical: 5,
  },
});

export default App;