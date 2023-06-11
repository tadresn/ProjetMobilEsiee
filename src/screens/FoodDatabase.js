import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Searchbar, Button, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { storeData } from '../context/storage';
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
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [quantityFood, setQuantityFood] = useState(null);
  const [dateFood, setDateFood] = useState(new Date());
  const [meal, setMeal] = useState(allMeal.get('Breakfast'));
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const storeFood = async () => {
    setModalVisible(false);
    const data = {
      Food: selectedFood,
      Energy: selectedEnergy,
      Quantity: quantityFood,
    };
    if (dateFromRoute && mealFromRoute) {
      await storeData(dateFromRoute, mealFromRoute, data);
    } else {
      await storeData(dateFood.toDateString(), meal.toString(), data);
    }
    setModalVisible(false);
  };

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

  const openModal = (food, energy) => {
    setSelectedFood(food);
    setSelectedEnergy(energy);
    setModalVisible(true);
    setMeal(allMeal.get('Breakfast'));
    setDateFood(new Date());
    setQuantityFood(null);
    setShowDateTimePicker(false);
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateFood;
    setDateFood(currentDate);
    setShowDateTimePicker(false);
  };

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    if (quantityFood) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }

    const unsubscribe = navigation.addListener('blur', () => {
      navigation.setParams({
        dateFromRoute: undefined,
        mealFromRoute: undefined,
      });
    });
    return unsubscribe;
  }, [quantityFood, navigation]);

  const { dateFromRoute, mealFromRoute } = route.params || {};

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
                  {hint.food.nutrients.ENERC_KCAL ? (
                    <Text style={styles.nutrientValue}>
                      {hint.food.nutrients.ENERC_KCAL.toFixed(2)} kcal per 100 grams
                    </Text>
                  ) : (
                    <Text style={styles.nutrientValue}>0 kcal per 100 grams</Text>
                  )}
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Protein</Text>
                  {hint.food.nutrients.PROCNT ? (
                    <Text style={styles.nutrientValue}>
                      {hint.food.nutrients.PROCNT.toFixed(2)} g per 100 grams
                    </Text>
                  ) : (
                    <Text style={styles.nutrientValue}>0 g per 100 grams</Text>
                  )}
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Fat</Text>
                  {hint.food.nutrients.FAT ? (
                    <Text style={styles.nutrientValue}>
                      {hint.food.nutrients.FAT.toFixed(2)} g per 100 grams
                    </Text>
                  ) : (
                    <Text style={styles.nutrientValue}>0 g per 100 grams</Text>
                  )}
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Carbohydrates</Text>
                  {hint.food.nutrients.CHOCDF ? (
                    <Text style={styles.nutrientValue}>
                      {hint.food.nutrients.CHOCDF.toFixed(2)} g per 100 grams
                    </Text>
                  ) : (
                    <Text style={styles.nutrientValue}>0 g per 100 grams</Text>
                  )}
                </View>
                <View style={styles.nutrientRow}>
                  <Text style={styles.nutrientLabel}>Dietary fiber</Text>
                  {hint.food.nutrients.FIBTG ? (
                    <Text style={styles.nutrientValue}>
                      {hint.food.nutrients.FIBTG.toFixed(2)} g per 100 grams
                    </Text>
                  ) : (
                    <Text style={styles.nutrientValue}>0 g per 100 grams</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  openModal(hint.food.label, hint.food.nutrients.ENERC_KCAL.toFixed(2))
                }
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
                  label="Quantity *"
                  value={quantityFood}
                  onChangeText={setQuantityFood}
                  keyboardType="numeric"
                  style={styles.decalageBottom}
                />
                <Text style={styles.pickerLabel}>Date</Text>
                <View style={styles.dateRow}>
                  {dateFromRoute && mealFromRoute ? (
                    <Text style={styles.styleText}>{dateFromRoute}</Text>
                  ) : (
                    <>
                      <Text style={styles.styleText}>{dateFood.toDateString()}</Text>
                      <IconButton
                        icon="pencil"
                        iconColor="#ff4081"
                        onPress={() => setShowDateTimePicker(true)}
                      />
                    </>
                  )}
                </View>
                {showDateTimePicker && (
                  <DateTimePicker
                    value={dateFood}
                    mode="date"
                    onChange={handleDate}
                    minimumDate={new Date()}
                    style={styles.decalageBottom}
                  />
                )}
                <View style={styles.decalageBottom}>
                  <Text style={styles.pickerLabel}>Meal</Text>
                  {dateFromRoute && mealFromRoute ? (
                    <Text style={styles.styleText}>{mealFromRoute}</Text>
                  ) : (
                    <Picker
                      selectedValue={meal}
                      onValueChange={(meal) => setMeal(meal)}
                      itemStyle={styles.pickerItem}>
                      {Array.from(allMeal, ([key, value]) => (
                        <Picker.Item key={value} label={value} value={value} />
                      ))}
                    </Picker>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    style={[
                      styles.button,
                      { backgroundColor: isButtonDisabled ? '#bbbbbb' : '#a692c7' },
                    ]}
                    onPress={storeFood}
                    disabled={isButtonDisabled}>
                    <Text style={styles.textStyle}>Add</Text>
                  </Button>
                  <Button style={styles.button} onPress={closeModal}>
                    Close
                  </Button>
                </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    borderRadius: 4,
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleText: {
    fontSize: 18,
  },
});

export default FoodDatabase;
