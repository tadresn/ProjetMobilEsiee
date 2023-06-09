import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { retrieveData } from '../context/storage';

const MealPlanning = () => {
  const [date, setDate] = useState(new Date());
  const [mealData, setMealData] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const handleDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    getFoodData(currentDate);
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

  const renderMealTable = (mealName, mealData) => {
    return (
      <View style={styles.mealTable}>
        <Text style={styles.mealName}>{mealName}</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Food</Text>
          <Text style={styles.tableHeader}>Energy (kcal per 100g)</Text>
          <Text style={styles.tableHeader}>Total Energy</Text>
        </View>
        {mealData.map((food, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{food.Food}</Text>
            <Text style={styles.tableCell}>{food.Energy}</Text>
            <Text style={styles.tableCell}>{(food.Quantity * food.Energy) / 100}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Energy</Text>
          <Text style={styles.totalValue}>{calculateTotalEnergy(mealData)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.label}>Meals for:</Text>
          <TouchableOpacity
            onPress={() => setShowDateTimePicker(true)}
            style={styles.dateTimeContainer}>
            <Text style={styles.pickerLabel}>Date</Text>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDateTimePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={handleDate}
              minimumDate={new Date()}
              style={styles.dateTimePicker}
            />
          )}
        </View>
        {mealData && (
          <View>
            {mealData.Breakfast && renderMealTable('Breakfast', mealData.Breakfast)}
            {mealData.Lunch && renderMealTable('Lunch', mealData.Lunch)}
            {mealData.Snack && renderMealTable('Snack', mealData.Snack)}
            {mealData.Dinner && renderMealTable('Dinner', mealData.Dinner)}
            <View style={styles.totalEnergyContainer}>
              <Text style={styles.totalEnergyLabel}>Total Energy for all meals:</Text>
              <Text style={styles.totalEnergyValue}>
                {calculateTotalEnergy(mealData.Breakfast) +
                  calculateTotalEnergy(mealData.Lunch) +
                  calculateTotalEnergy(mealData.Snack) +
                  calculateTotalEnergy(mealData.Dinner)}
              </Text>
            </View>
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dateTimePicker: {
    alignSelf: 'flex-start',
  },
  mealTable: {
    marginVertical: 16,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
    color: 'blue',
  },
  totalEnergyContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  totalEnergyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalEnergyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default MealPlanning;
