import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import FoodDatabase from '../screens/FoodDatabase';
import HealthGoals from '../screens/HealthGoals';
import MealPlanning from '../screens/MealPlanning';

const Tab = createMaterialBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator activeColor="#ff4081" barStyle={{ backgroundColor: '#d1c4e9' }}>
        <Tab.Screen
          name="Health Goals"
          component={HealthGoals}
          options={{
            tabBarIcon: 'heart',
          }}
        />
        <Tab.Screen
          name="Food Database"
          component={FoodDatabase}
          options={{
            tabBarIcon: 'food',
          }}
        />
        <Tab.Screen
          name="Meal Planning"
          component={MealPlanning}
          options={{
            tabBarIcon: 'calendar',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
