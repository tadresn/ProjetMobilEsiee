import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (date, meal, foodData) => {
  try {
    const storedData = await AsyncStorage.getItem(date);

    if (storedData) {
      const newData = JSON.parse(storedData);
      newData[meal].push(foodData);
      await AsyncStorage.setItem(date, JSON.stringify(newData));
    } else {
      const addData = {
        Breakfast: [],
        Lunch: [],
        Snack: [],
        Dinner: [],
      };
      addData[meal].push(foodData);
      await AsyncStorage.setItem(date, JSON.stringify(addData));
    }
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const retrieveData = async (date) => {
  try {
    const storedData = await AsyncStorage.getItem(date);

    if (storedData) {
      const data = JSON.parse(storedData);
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const deleteData = async (date, meal, foodData) => {
  try {
    const storedData = await AsyncStorage.getItem(date);

    if (storedData) {
      const existingData = JSON.parse(storedData);

      const mealData = existingData[meal];
      const index = mealData.findIndex(
        (item) =>
          item.Food === foodData.Food &&
          item.Energy === foodData.Energy &&
          item.Quantity === foodData.Quantity
      );

      if (index !== -1) {
        mealData.splice(index, 1);

        if (
          existingData['Breakfast'].length === 0 &&
          existingData['Lunch'].length === 0 &&
          existingData['Snack'].length === 0 &&
          existingData['Dinner'].length === 0
        ) {
          await AsyncStorage.removeItem(date);
        } else {
          await AsyncStorage.setItem(date, JSON.stringify(existingData));
        }
      }
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};
