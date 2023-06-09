import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Switch, TextInput } from 'react-native-paper';

const HealthGoals = () => {
  const allActivityLevels = new Map([
    ['Sedentary', 'Sedentary'],
    ['Light', 'Light Exercise'],
    ['Moderate', 'Moderate Exercise'],
    ['Heavy', 'Heavy Exercise'],
    ['Extra', 'Extra active'],
  ]);

  const allHealthGoals = new Map([
    ['Loss', 'Weight Loss'],
    ['Maintenance', 'Weight Maintenance'],
    ['Gain', 'Weight Gain'],
  ]);

  const [age, setAge] = useState('');
  const [isMale, setIsMale] = useState(false);
  const toggleSwitch = () => setIsMale((previousState) => !previousState);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState(allActivityLevels.get('Sedentary'));
  const [healthGoal, setHealthGoal] = useState(allHealthGoals.get('Loss'));
  const [BMR, setBMR] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function calculateBMR(age, isMale, height, weight, activityLevel, healthGoal) {
    let BMR = 0;

    if (isMale) BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    else BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

    if (activityLevel === allActivityLevels.get('Sedentary')) BMR *= 1.2;
    else if (activityLevel === allActivityLevels.get('Light')) BMR *= 1.375;
    else if (activityLevel === allActivityLevels.get('Moderate')) BMR *= 1.55;
    else if (activityLevel === allActivityLevels.get('Heavy')) BMR *= 1.725;
    else if (activityLevel === allActivityLevels.get('Extra')) BMR *= 1.9;

    if (healthGoal === allHealthGoals.get('Loss')) BMR -= 500;
    else if (healthGoal === allHealthGoals.get('Gain')) BMR += 500;

    return Math.round(BMR);
  }

  useEffect(() => {
    if (age && height && weight) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [age, height, weight]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Health Goals</Text>
        <TextInput
          label="Age *"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.decalageBottom}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Are you a male ? *</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#d1c4e9' }}
            thumbColor={isMale ? '#ff4081' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isMale}
          />
        </View>
        <TextInput
          label="Height *"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.decalageBottom}
        />
        <TextInput
          label="Weight *"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={styles.decalageBottom}
        />
        <View style={styles.decalageBottom}>
          <Text style={styles.pickerLabel}>Activity Level *</Text>
          <Picker
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
            itemStyle={styles.pickerItem}
            numberOfLines={2}>
            {Array.from(allActivityLevels, ([key, value]) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>
        <View style={styles.decalageBottom}>
          <Text style={styles.pickerLabel}>Health Goal *</Text>
          <Picker
            selectedValue={healthGoal}
            onValueChange={(itemValue) => setHealthGoal(itemValue)}
            itemStyle={styles.pickerItem}>
            {Array.from(allHealthGoals, ([key, value]) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>
        <Button
          onPress={() =>
            setBMR(calculateBMR(age, isMale, height, weight, activityLevel, healthGoal))
          }
          disabled={isButtonDisabled}
          style={[styles.button, { backgroundColor: isButtonDisabled ? '#bbbbbb' : '#2196F3' }]}
          labelStyle={styles.buttonLabel}>
          Calculate
        </Button>
        <Text style={styles.title}>BMR : {BMR} calories/day</Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    marginRight: 8,
  },
  pickerLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerItem: {
    height: 50,
  },
  button: {
    marginTop: 10,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
});

export default HealthGoals;
