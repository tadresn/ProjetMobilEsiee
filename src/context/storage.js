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
