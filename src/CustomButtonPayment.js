import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';

import Card from './Components/PaymentCard';

const CustomButtonPayment = () => {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');

  useEffect(() => {
    // Test if the SDK is initialized
    console.log(
      'Checking if CFPaymentGatewayService exists:',
      !!CFPaymentGatewayService,
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Custom Payment with Cashfree</Text>
      <Text style={styles.header}>{selectedPaymentMethod}</Text>

      <Card 
        value={"UPI"}
        onPress={() => setSelectedPaymentMethod('UPI')}
        selectedPaymentMethod={selectedPaymentMethod}
      />

      <Card 
        value={"CARD"}
        onPress={() => setSelectedPaymentMethod('CARD')}
        selectedPaymentMethod={selectedPaymentMethod}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    width:'90%',
    alignSelf:'center'
  },
  buttonContainer: {
    marginBottom: 20,
  },
  paymentForm: {
    marginBottom: 20,
  },
  paymentStatus: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
  },
});

export default memo(CustomButtonPayment);
