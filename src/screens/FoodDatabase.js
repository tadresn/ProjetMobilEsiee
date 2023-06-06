import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';

import { searchFoodByName } from '../services/FoodDatabaseService';

const FoodDatabase = () => {
  const [userSearch, setUserSearch] = useState('');
  const [resultAPI, setResultAPI] = useState(null);

  async function handleSearch() {
    await searchFoodByName(userSearch)
      .then((response) => {
        setResultAPI(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Searchbar
          placeholder="Search"
          value={userSearch}
          onChangeText={setUserSearch}
          onIconPress={handleSearch}
        />
        {resultAPI?.hints.map((hint, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.label}>{hint.food.label}</Text>
            <Image source={{ uri: hint.food.image }} style={styles.image} key={hint.food.foodId} />
            <View style={styles.nutrientsContainer}>
              <Text>Nutriments:</Text>
              {Object.entries(hint.food.nutrients).map(([key, value]) => (
                <Text key={key}>
                  {key}: {value}
                </Text>
              ))}
            </View>
            <View style={styles.measureContainer}>
              <Text>Mesure pour un plat entier:</Text>
              {hint.measures.map((measure) => {
                if (measure.label === 'Whole') {
                  return (
                    <Text key={measure.uri}>
                      {measure.label}: {measure.weight}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  nutrientsContainer: {
    marginBottom: 8,
  },
  measureContainer: {
    marginBottom: 8,
  },
});

export default FoodDatabase;
