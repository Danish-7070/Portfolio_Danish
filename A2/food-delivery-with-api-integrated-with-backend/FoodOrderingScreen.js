import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock data since we can't fetch from a live API in this context
const mockRestaurants = [
  { id: 1, name: 'Burger Bonanza', cuisine: 'Burger', rating: 4.5, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Pizza Palace', cuisine: 'Pizza', rating: 4.8, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Sandwich Stop', cuisine: 'Sandwich', rating: 4.2, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Burger Bliss', cuisine: 'Burger', rating: 4.6, image: 'https://via.placeholder.com/150' },
];

const FoodOrderingScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  // Simulate fetching data
  useEffect(() => {
    const fetchRestaurants = () => {
      setTimeout(() => { // Simulate network delay
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
        setLoading(false);
      }, 1000);
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants by cuisine type
  const filterRestaurants = (cuisine) => {
    setSelectedCuisine(cuisine);
    if (cuisine === 'All') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) => restaurant.cuisine === cuisine);
      setFilteredRestaurants(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color="#f57c00" />
          <Text style={styles.locationText}>Islamabad, Pakistan <Icon name="arrow-drop-down" size={16} color="#f57c00" /></Text>
        </View>
        <Text style={styles.headerTitle}>Order Your Food Fast and Free</Text>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3275/3275978.png' }}
          style={styles.deliveryIcon}
          resizeMode="contain"
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.searchOptions}>
          <Icon name="more-vert" size={24} color="#f57c00" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {['All', 'Burger', 'Pizza', 'Sandwich'].map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[styles.categoryButton, selectedCuisine === cuisine && styles.activeCategory]}
            onPress={() => filterRestaurants(cuisine)}
          >
            <Icon
              name={cuisine === 'Pizza' ? 'local-pizza' : cuisine === 'Sandwich' ? 'hot-dog' : 'local-dining'}
              size={20}
              color={selectedCuisine === cuisine ? '#fff' : '#f57c00'}
            />
            <Text style={[styles.categoryText, selectedCuisine === cuisine && { color: '#fff' }]}>
              {cuisine === 'Sandwich' ? 'Sandw' : cuisine}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Restaurants List */}
      <ScrollView style={styles.foodItemsContainer}>
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.foodItemCard}>
            <Image
              source={{ uri: restaurant.image }}
              style={styles.foodItemImage}
              resizeMode="cover"
            />
            <View style={styles.foodItemDetails}>
              <Text style={styles.foodItemName}>{restaurant.name}</Text>
              <Text style={styles.foodItemPrice}>{restaurant.cuisine}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#f57c00" />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#f57c00" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="shopping-bag" size={24} color="#f57c00" />
          <Text style={styles.navText}>Bag</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="more-vert" size={24} color="#f57c00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 15, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { fontSize: 14, color: '#f57c00', marginLeft: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  deliveryIcon: { width: 100, height: 100 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, marginHorizontal: 10, marginVertical: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  searchOptions: { padding: 5 },
  categoriesContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' },
  categoryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#f57c00' },
  activeCategory: { backgroundColor: '#f57c00' },
  categoryText: { fontSize: 14, color: '#f57c00', marginLeft: 5 },
  foodItemsContainer: { padding: 10 },
  foodItemCard: { width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  foodItemImage: { width: '100%', height: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  foodItemDetails: { padding: 10 },
  foodItemName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  foodItemPrice: { fontSize: 14, color: '#666' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { fontSize: 14, color: '#f57c00', marginLeft: 5 },
  addButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#f57c00', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingVertical: 10, backgroundColor: '#fff' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#f57c00', marginTop: 5 },
});

export default FoodOrderingScreen;