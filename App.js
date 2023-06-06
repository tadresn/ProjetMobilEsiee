import React from 'react';

import AppNavigator from './src/navigation/AppNavigator';
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

const App = () => {
  return <AppNavigator />;
};

export default App;
