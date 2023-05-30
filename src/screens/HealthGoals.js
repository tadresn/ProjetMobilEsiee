import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Switch, TextInput } from 'react-native-paper';

const HealthGoals = () => {
  const [age, setAge] = useState('');
  const [isMale, setIsMale] = useState(false);
  const toggleSwitch = () => setIsMale((previousState) => !previousState);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  const [healthGoal, setHealthGoal] = useState('Weight Loss');
  const [BMR, setBMR] = useState(0);
  function calculateBMR(age, isMale, height, weight, activityLevel, healthGoal) {
    let BMR = 0;
    if (isMale) BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    else BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    if (activityLevel === 'Sedentary') BMR *= 1.2;
    else if (activityLevel === 'Light Exercice') BMR *= 1.375;
    else if (activityLevel === 'Moderate Exercice') BMR *= 1.55;
    else if (activityLevel === 'Heavy Exercice') BMR *= 1.725;
    else if (activityLevel === 'Extra active') BMR *= 1.9;
    if (healthGoal === 'Weight Loss') BMR -= 500;
    else if (healthGoal === 'Weight Gain') BMR += 500;
    return Math.round(BMR);
  }
  return (
    <ScrollView contentContainerStyle= {styles.container}>
      <View>
        <TextInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Text>Are you a male ?</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#d1c4e9' }}
          thumbColor={isMale ? '#ff4081' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isMale}
        />
        <TextInput label="Height" value={height} onChangeText={setHeight} keyboardType="numeric" />
        <TextInput label="Weight" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <Picker
          selectedValue={activityLevel}
          onValueChange={(itemValue, itemIndex) => setActivityLevel(itemValue)}>
          <Picker.Item label="Sedentary" value="Sedentary" />
          <Picker.Item label="Light Exercise" value="Light Exercise" />
          <Picker.Item label="Moderate Exercise" value="Moderate Exercise" />
          <Picker.Item label="Heavy Exercise" value="Heavy Exercise" />
          <Picker.Item label="Extra active" value="Extra active" />
        </Picker>
        <Picker
          selectedValue={healthGoal}
          onValueChange={(itemValue, itemIndex) => setHealthGoal(itemValue)}>
          <Picker.Item label="Weight Loss" value="Weight Loss" />
          <Picker.Item label="Weight Maintenance" value="Weight Maintenance" />
          <Picker.Item label="Weight Gain" value="Weight Gain" />
        </Picker>
        <Button
          onPress={() => setBMR(calculateBMR(age, isMale, height, weight, activityLevel, healthGoal))}
          buttonColor= '#2196F3'
        >Calculate</Button>
        <Text style={styles.titre}>BMR : {BMR} calories/day</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1
  },
  titre: {
    fontSize: 30,
    fontFamily: "sans-serif",
    textAlign: "center"
  }
});

export default HealthGoals;