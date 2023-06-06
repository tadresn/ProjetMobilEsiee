import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, DatePickerIOSBase } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';

import { searchFoodByName } from '../services/FoodDatabaseService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';

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

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = (food)=>{
    setCurrentFood(food);
    setModalVisible(true);
  }
  return (
    <SafeAreaView>
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
            <Button
              onPress={() => openModal(hint.food.label)}
              style={[styles.button, { backgroundColor: '#2196F3' }]}
              labelStyle={styles.buttonLabel}>
              Show Modal
            </Button>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!{currentFood}</Text>
              <DatePickerInput
                locale="en-GB"
                label="Sélectionner une date"
                value={selectedDate}
                mode="date"
                onChange={(event, selectedDate) => {
                  setSelectedDate(selectedDate);
                }}
                style={styles.datePicker}
              />
              <Button
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
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
  button: {
    marginTop: 10,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default FoodDatabase;