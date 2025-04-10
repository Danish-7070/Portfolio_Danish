import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For navigation and category icons

const TravelAppScreen = () => {
  const categories = [
    { icon: 'flight', label: 'Flights' },
    { icon: 'hotel', label: 'Hotels' },
    { icon: 'directions-car', label: 'Car' },
    { icon: 'train', label: 'Train' },
  ];

  const destinations = [
    {
      name: 'Paris',
      country: 'France',
      rating: '4.5',
      image: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/paris-1868537_1280.jpg', // Placeholder for Paris (Eiffel Tower)
    },
    {
      name: 'Indonesia',
      country: 'Indonesia',
      rating: '4',
      image: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/bali-2697917_1280.jpg', // Placeholder for Indonesia (temple)
    },
  ];

  return (
    <View style={styles.container}>
      {/* Status Bar Placeholder (Time and Signal Icons) */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>11:11 am</Text>
        <View style={styles.statusIcons}>
          <Icon name="signal-wifi-3-bar" size={16} color="#000" />
          <Icon name="battery-full" size={16} color="#000" style={styles.batteryIcon} />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Hi, Danish</Text>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://cdn.pixabay.com/photo/2016/11/14/03/16/airplane-1822074_1280.jpg' }} // Placeholder for airplane banner
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <Text style={styles.bannerText}>Let’s Discover a New Adventure !</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Icon name={category.icon} size={24} color="#000" />
            <Text style={styles.categoryText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explore Destination */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXPLORE DESTINATION</Text>
      </View>

      {/* Destination Cards */}
      <View style={styles.destinationsContainer}>
        {destinations.map((destination, index) => (
          <View key={index} style={styles.destinationCard}>
            <Image
              source={{ uri: destination.image }}
              style={styles.destinationImage}
              resizeMode="cover"
            />
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationCountry}>{destination.country}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#f57c00" />
                <Text style={styles.ratingText}>{destination.rating}</Text>
              </View>
            </View>
            <Icon name="favorite" size={24} color="#f57c00" style={styles.favoriteIcon} />
          </View>
        ))}
      </View>

      {/* Best Deals Section */}
      <View style={styles.bestDealsHeader}>
        <Text style={styles.bestDealsText}>BEST DEALS !</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="flight" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.searchNavItem]}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="notifications" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  timeText: {
    fontSize: 12,
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryIcon: {
    marginLeft: 5,
  },
  header: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  bannerContainer: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bannerText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    top: 50,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  categoryText: {
    fontSize: 12,
    color: '#000',
    marginTop: 5,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#e3f2fd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  destinationsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  destinationInfo: {
    padding: 10,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  destinationCountry: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#f57c00',
    marginLeft: 5,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bestDealsHeader: {
    padding: 10,
    backgroundColor: '#e3f2fd',
  },
  bestDealsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    backgroundColor: '#e3f2fd',
  },
  navItem: {
    alignItems: 'center',
  },
  searchNavItem: {
    backgroundColor: '#2196f3',
    borderRadius: 15,
    padding: 10,
  },
});

export default TravelAppScreen;