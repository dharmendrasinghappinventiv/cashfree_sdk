/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import PaymentScreen from './src/Payment';
import CustomButtonPayment from './src/CustomButtonPayment';

function App(): React.JSX.Element {
  return (
    // <View style={styles.sectionContainer}>
    //   <PaymentScreen />
    // </View>
    <View style={styles.sectionContainer}>
      <CustomButtonPayment />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
});

export default App;
