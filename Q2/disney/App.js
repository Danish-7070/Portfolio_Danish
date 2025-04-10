import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const API_URL = "https://api.disneyapi.dev/character";

const DisneyMovies = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const movieData = data.data.map((item) => ({
        title: item.name,
        description: item.films?.join(", ") || "No description available",
        rating: item.tvShows?.length || "N/A",
        image: item.imageUrl,
      }));
      setMovies(movieData);
      setFilteredMovies(movieData);
      await AsyncStorage.setItem("disneyMovies", JSON.stringify(movieData));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate("MovieDetail", { movie });
  };

  const handleSearch = () => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 8,
            borderRadius: 5,
          }}
          placeholder="Search for a movie..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 10 }}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMoviePress(item)}>
              <View style={{ marginBottom: 20, alignItems: "center" }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 200, height: 200, borderRadius: 10 }}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 }}>{item.description}</Text>
                <Text style={{ fontSize: 16, marginTop: 5 }}>Rating: {item.rating}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default DisneyMovies;
