import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Searchbar, Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchFoodByName } from '../services/FoodDatabaseService';

const FoodDatabase = () => {
  const allMeal = new Map([
    ['Breakfast', 'Breakfast'],
    ['Lunch', 'Lunch'],
    ['Snack', 'Snack'],
    ['Dinner', 'Dinner'],
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [resultAPI, setResultAPI] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantityFood, setQuantityFood] = useState(null);
  const [dateFood, setDateFood] = useState(new Date());
  const [meal, setMeal] = useState(allMeal.get('Breaskfast'));

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

  const openModal = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const handleDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateFood;
    setDateFood(currentDate);
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
                <Text style={[styles.label, styles.centerText]}>
                  Please fill in the fields to add the food.
                </Text>
                <TextInput
                  label="Food"
                  value={selectedFood}
                  editable={false}
                  style={styles.disabledTextInput}
                />
                <TextInput
                  label="Quantity"
                  value={quantityFood}
                  onChangeText={setQuantityFood}
                  keyboardType="numeric"
                  style={styles.decalageBottom}
                />
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.pickerLabel}>Date</Text>
                  <DateTimePicker
                    value={dateFood}
                    mode="date"
                    onChange={handleDate}
                    minimumDate={new Date()}
                    style={styles.decalageBottom}
                  />
                </View>
                <View style={styles.decalageBottom}>
                  <Text style={styles.pickerLabel}>Meal</Text>
                  <Picker
                    selectedValue={meal}
                    onValueChange={(meal) => setMeal(meal)}
                    itemStyle={styles.pickerItem}>
                    {Array.from(allMeal, ([key, value]) => (
                      <Picker.Item key={value} label={value} value={value} />
                    ))}
                  </Picker>
                </View>
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
  disabledTextInput: {
    backgroundColor: '#f2f2f2',
    color: '#888888',
    marginBottom: 16,
    marginTop: 8,
  },
  pickerItem: {
    height: 50,
  },
  pickerLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    alignItems: 'flex-start',
  },
});

export default FoodDatabase;
