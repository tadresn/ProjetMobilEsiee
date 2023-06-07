import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchFoodByName } from '../services/FoodDatabaseService';

const FoodDatabase = () => {
  const [userSearch, setUserSearch] = useState('');
  const [resultAPI, setResultAPI] = useState(null);
  const [currentFood, setCurrentFood] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  async function handleSearch() {
    await searchFoodByName(userSearch)
      .then((response) => {
        setResultAPI(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleSubmit = () => {
    if (userSearch === '') {
      setResultAPI(null);
      return;
    }
    handleSearch();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = (food) => {
    setCurrentFood(food);
    setModalVisible(true);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Searchbar
            placeholder="Search"
            value={userSearch}
            onChangeText={setUserSearch}
            onIconPress={handleSubmit}
            onSubmitEditing={handleSubmit}
            style={styles.decalageBottom}
          />
          {resultAPI === null && <Text style={styles.centerText}>Please enter your search</Text>}
          {resultAPI?.hints.length === 0 && (
            <Text style={styles.centerText}>No results matching your search</Text>
          )}
          {resultAPI?.hints.map((hint, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.label, styles.centerText]}>{hint.food.label}</Text>
              {hint.food.image ? (
                <Image
                  source={{ uri: hint.food.image }}
                  style={[styles.image, styles.centerImage]}
                />
              ) : (
                <View style={[styles.image, styles.centerImage, styles.noImageContainer]}>
                  <Text style={styles.textStyle}>No image for this food</Text>
                </View>
              )}
              <View style={styles.nutrientsContainer}>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Energy</Text>
                  <Text style={styles.nutrientValue}>
                    {hint.food.nutrients.ENERC_KCAL} kcal per 100 grams
                  </Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Protein</Text>
                  <Text style={styles.nutrientValue}>
                    {hint.food.nutrients.PROCNT} g per 100 grams
                  </Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Fat</Text>
                  <Text style={styles.nutrientValue}>
                    {hint.food.nutrients.FAT} g per 100 grams
                  </Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Carbohydrates</Text>
                  <Text style={styles.nutrientValue}>
                    {hint.food.nutrients.CHOCDF} g per 100 grams
                  </Text>
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Dietary fiber</Text>
                  <Text style={styles.nutrientValue}>
                    {hint.food.nutrients.FIBTG} g per 100 grams
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => openModal(hint.food.label)}
                style={styles.openModalButton}>
                <Text style={styles.textStyle}>Add to my meal</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Bonjour tout le monde ! {currentFood}</Text>
                <DatePickerInput
                  locale="en-GB"
                  label="Sélectionner une date"
                  value={selectedDate}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setSelectedDate(selectedDate);
                  }}
                  onConfirm={(date) => {
                    setSelectedDate(date);
                  }}
                />
                <Button onPress={() => setModalVisible(!modalVisible)}>
                  <Text>Close</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  decalageBottom: {
    marginBottom: 16,
  },
  centerText: {
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    backgroundColor: '#eae6fb',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  centerImage: {
    alignSelf: 'center',
  },
  noImageContainer: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  nutrientsContainer: {
    marginBottom: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  nutrientLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  nutrientValue: {
    marginTop: 4,
  },
  openModalButton: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
});

export default FoodDatabase;
