import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteData, retrieveData } from '../context/storage';

const MealPlanning = () => {
  const [date, setDate] = useState(new Date());
  const [mealData, setMealData] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  useEffect(() => {
    getFoodData(date);
  }, [date]);

  useFocusEffect(
    React.useCallback(() => {
      getFoodData(date);
    }, [date])
  );

  const handleDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDateTimePicker(false);
  };

  const getFoodData = async (selectedDate) => {
    const foodData = await retrieveData(selectedDate.toDateString());
    setMealData(foodData);
  };

  const calculateTotalEnergy = (meal) => {
    let totalEnergy = 0;
    meal.forEach((food) => {
      const { Quantity, Energy } = food;
      totalEnergy += (Quantity * Energy) / 100;
    });
    return totalEnergy;
  };

  const deleteFood = async (meal, data) => {
    await deleteData(date.toDateString(), meal, data);
    getFoodData(date);
  };

  const navigation = useNavigation();
  const navigateToDataBase = (dateFromRoute, mealFromRoute) => {
    navigation.navigate('Food Database', { dateFromRoute, mealFromRoute });
  };

  const renderMealTable = (mealName, mealData) => {
    if (mealData.length === 0) {
      return (
        <View style={styles.mealTable}>
          <Text style={[styles.importantText, styles.decalageBottom]}>{mealName}</Text>
          <Text style={[styles.tableCell, styles.decalageBottom]}>Nothing</Text>
          <Button onPress={() => navigateToDataBase(date.toDateString(), mealName)}>
            Add Food
          </Button>
        </View>
      );
    }
    return (
      <View style={styles.mealTable}>
        <Text style={[styles.importantText, styles.decalageBottom]}>{mealName}</Text>
        <View style={styles.tableRow}>
          <Text style={styles.importantTextMeal}>Food</Text>
          <Text style={styles.importantTextMeal}>Energy (kcal per 100g)</Text>
          <Text style={styles.importantTextMeal}>Energy for your quantity</Text>
          <Text style={styles.importantTextMeal}>Delete</Text>
        </View>
        {mealData.map((food, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{food.Food}</Text>
            <Text style={styles.tableCell}>{food.Energy}</Text>
            <Text style={styles.tableCell}>
              {(food.Quantity * food.Energy) / 100} ({food.Quantity}g)
            </Text>
            <IconButton
              icon="close"
              iconColor="red"
              style={[styles.tableCell, { marginTop: -10 }]}
              onPress={() => deleteFood(mealName, food)}
            />
          </View>
        ))}
        <Text style={[styles.importantTextMeal, styles.decalageTop]}>
          Total Energy : {calculateTotalEnergy(mealData)} kcal
        </Text>
        <Button onPress={() => navigateToDataBase(date.toDateString(), mealName)}>Add Food</Button>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateTimeContainer}>
        <View style={styles.centerContainer}>
          <Text style={styles.importantText}>{date.toDateString()}</Text>
          <IconButton
            icon="pencil"
            iconColor="#ff4081"
            onPress={() => setShowDateTimePicker(true)}
          />
        </View>
        {showDateTimePicker && (
          <DateTimePicker value={date} mode="date" onChange={handleDate} minimumDate={new Date()} />
        )}
      </View>
      <ScrollView>
        {mealData ? (
          <View>
            {mealData.Breakfast && renderMealTable('Breakfast', mealData.Breakfast)}
            {mealData.Lunch && renderMealTable('Lunch', mealData.Lunch)}
            {mealData.Snack && renderMealTable('Snack', mealData.Snack)}
            {mealData.Dinner && renderMealTable('Dinner', mealData.Dinner)}
            <View style={styles.decalageTop}>
              <Text style={styles.importantText}>Total Energy for the day:</Text>
              <Text style={styles.totalEnergyValue}>
                {calculateTotalEnergy(mealData.Breakfast) +
                  calculateTotalEnergy(mealData.Lunch) +
                  calculateTotalEnergy(mealData.Snack) +
                  calculateTotalEnergy(mealData.Dinner)}
                kcal
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {renderMealTable('Breakfast', [])}
            {renderMealTable('Lunch', [])}
            {renderMealTable('Snack', [])}
            {renderMealTable('Dinner', [])}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    backgroundColor: '#d1c4e9',
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 55,
  },
  mealTable: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#F5F5F5',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333333',
  },
  importantTextMeal: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#333333',
  },
  decalageTop: {
    marginTop: 16,
  },
  decalageBottom: {
    marginBottom: 16,
  },
  importantText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  totalEnergyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
});

export default MealPlanning;
