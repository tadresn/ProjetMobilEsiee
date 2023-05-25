import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';

import HealthGoals from '../screens/HealthGoals';
import FoodDatabase from '../screens/FoodDatabase';
import MealPlanning from '../screens/MealPlanning';

const Tab = createMaterialBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HealthGoals" component={HealthGoals} />
        <Tab.Screen name="FoodDatabase" component={FoodDatabase} />
        <Tab.Screen name="MealPlanning" component={MealPlanning} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;