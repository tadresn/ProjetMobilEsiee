import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Switch, TextInput } from 'react-native-paper';

const HealthGoals = () => {
  const [age, setAge] = useState('');
  const [isMale, setIsMale] = useState(false);
  const toggleSwitch = () => setIsMale((previousState) => !previousState);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  const [healthGoal, setHealthGoal] = useState('Weight Loss');
  return (
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
      <Text>Welcome to the HealthGoals Screen!</Text>
    </View>
  );
};

export default HealthGoals;
