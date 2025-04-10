import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For navigation icons

const LinkoScreen = () => {
  // List of random image URLs for stories (replace with your own or use a public API)
  const storyImages = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
  ];

  // Shuffle the story images randomly (Fisher-Yates shuffle)
  const shuffledStories = [...storyImages].sort(() => Math.random() - 0.5).slice(0, 4); // Take 4 random images

  const posts = [
    {
      id: 'danish',
      name: 'Danish Niazi',
      location: 'Islamabad',
      image: 'https://cdn.statically.io/img/haleyblackall.com/wp-content/uploads/2021/08/Instagram-nature-captions-Nature-quotes-for-Instgram-1-8.jpg?quality=80&f=auto',
      likes: '0',
      comments: '0',
      shares: '0',
    },
    {
      id: 'haseeb',
      name: 'Haseeb',
      location: 'Islamabad',
      image: 'https://cdn.statically.io/img/haleyblackall.com/wp-content/uploads/2021/08/Instagram-nature-captions-Nature-quotes-for-Instgram-1-8.jpg?quality=80&f=auto',
      likes: '7.5k',
      comments: '425',
      shares: '25',
    },
    {
      id: 'maqsood',
      name: 'Maqsood',
      location: 'Chakrala',
      image: 'https://example.com/maqsood.jpg', // Replace with actual image URL
      likes: '1.2k',
      comments: '150',
      shares: '10',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={stories.headerText}>Linko</Text>
        <Icon name="notifications" size={24} color="#000" style={styles.notificationIcon} />
      </View>

      {/* Stories */}
      <View style={styles.storiesContainer}>
        <Text style={stories.storiesTitle}>Stories</Text>
        <View style={styles.stories}>
          {shuffledStories.map((story, index) => (
            <Image
              key={index}
              source={{ uri: story }}
              style={styles.storyImage}
            />
          ))}
        </View>
      </View>

      {/* Posts */}
      <View style={styles.postsContainer}>
        {posts.map((post, index) => (
          <View key={index} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: `https://example.com/${post.id}.jpg` }} // Replace with actual profile image URLs
                style={styles.profileImage}
              />
              <View style={styles.postUserInfo}>
                <Text style={styles.postName}>{post.name}</Text>
                <Text style={styles.postLocation}>{post.location}</Text>
              </View>
              <TouchableOpacity style={styles.postOptions}>
                <Text style={styles.postOptionsText}>⋮</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>❤️ {post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>😄 {post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>📤 {post.shares}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="add-box" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stories = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  storiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationIcon: {
    marginRight: 10,
  },
  storiesContainer: {
    padding: 10,
  },
  stories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  postsContainer: {
    flex: 1,
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
  },
  postOptions: {
    padding: 5,
  },
  postOptionsText: {
    fontSize: 24,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  actionButton: {
    padding: 5,
  },
  actionText: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 10,
  },
});

export default LinkoScreen;