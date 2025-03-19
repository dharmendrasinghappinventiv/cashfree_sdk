import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import {CFErrorResponse,CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  Card,
  CFCardPayment,
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
  CFUPI,
  CFUPIIntentCheckoutPayment, CFUPIPayment,
  SavedCard,
  UPIMode,
} from 'cashfree-pg-api-contract';

const PaymentOption = ({ label, value, selected, onSelect, onPay }) => {
  const bgColor = selected === value ? '#f0f0f0' : '#fff';
  return (
    <View style={[styles.cardContainer,{backgroundColor:bgColor}]}>
      <Pressable style={styles.rowContainer} onPress={() => onSelect(value)}>
        <RadioButton
          value={value}
          status={selected === value ? 'checked' : 'unchecked'}
          onPress={() => onSelect(value)}
        />
        <Text style={styles.optionText}>{label}</Text>
      </Pressable>
      <Collapsible collapsed={selected === value ? false : true}>
        <TouchableOpacity style={styles.submitButton} onPress={onPay}>
          <Text style={styles.buttonText}>Pay with {label}</Text>
        </TouchableOpacity>
      </Collapsible>
    </View>
  );
};

const payment_session_id = 'session_weRScfaHFFaZfI4VWc3BnSDXO5AMlw3d87s-92JnJCyAMRFSHHB8YeAbcITFFo73UdX_0DFbAolwjuKVgivqKxg6mzIx2yBMbmH4t6l7u4wRpB-HP2IBjjGNUApaymentpayment';
const order_id = '2efa24edd29e';

const TrueMads = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePayment = () => {
    console.log(`Processing payment with ${selectedPaymentMethod}`);
    // Implement payment logic here
    if(selectedPaymentMethod === "UPI"){
      handleUPIPayment()
    }else if(selectedPaymentMethod === "CARD"){
      handleCardPayment()
    }else if(selectedPaymentMethod === "WALLET"){
      handleWalletPayment()
    }else{
      handlePayLaterPayment()
    }

  };

    const handleUPIPayment = async () => {
      try {
        const apps = await CFPaymentGatewayService.getInstalledUpiApps();
        console.log('Callback for Fetch UPI Apps :::==>' + apps);
        
        console.log('Initializing payment session...');

        const session = new CFSession(
          payment_session_id,
          order_id,
          CFEnvironment.SANDBOX,
        );
        
        // Whatever payment modes you want to enable
        const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.UPI)
        .build();
        
        const payment = new CFDropCheckoutPayment(session, paymentModes, null);
        console.log('Payment gateway triggered');
        CFPaymentGatewayService.doPayment(payment);
      } catch (error) {
        console.error('Payment initialization error:', error);
        Alert.alert('Payment Error', error.message || 'An error occurred while initiating payment' );
      }
    }

    const handleCardPayment = async () => {
      try {
        console.log('Initializing payment session...');
        const session = new CFSession(
          payment_session_id,
          order_id,
          CFEnvironment.SANDBOX,
        );
        
        // Whatever payment modes you want to enable
        const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .build();
        
        const payment = new CFDropCheckoutPayment(session, paymentModes, null);
        console.log('Payment gateway triggered');
        CFPaymentGatewayService.doPayment(payment);
      } catch (error) {
        console.error('Payment initialization error:', error);
        Alert.alert('Payment Error', error.message || 'An error occurred while initiating payment' );
      }
    }

    const handleWalletPayment = async () => {  
      try {
        console.log('Initializing payment session...');
        const session = new CFSession(
          payment_session_id,
          order_id,
          CFEnvironment.SANDBOX,
        );
        
        // Whatever payment modes you want to enable
        const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.WALLET)
        .build();
        
        const payment = new CFDropCheckoutPayment(session, paymentModes, null);
        console.log('Payment gateway triggered');
        CFPaymentGatewayService.doPayment(payment);
      } catch (error) {
        console.error('Payment initialization error:', error);
        Alert.alert('Payment Error', error.message || 'An error occurred while initiating payment' );
      }
    }

    const handlePayLaterPayment = async () => {  
      try {
        console.log('Initializing payment session...');
        const session = new CFSession(
          payment_session_id,
          order_id,
          CFEnvironment.SANDBOX,
        );
        
        // Whatever payment modes you want to enable
        const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.PAY_LATER)
        .build();
        
        const payment = new CFDropCheckoutPayment(session, paymentModes, null);
        console.log('Payment gateway triggered');
        CFPaymentGatewayService.doPayment(payment);
      } catch (error) {
        console.error('Payment initialization error:', error);
        Alert.alert('Payment Error', error.message || 'An error occurred while initiating payment' );
      }
    }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment (TrueMads) with Cashfree</Text>
      <Text style={styles.selectedText}>Selected: {selectedPaymentMethod}</Text>

      <PaymentOption 
        label="UPI" 
        value="UPI" 
        selected={selectedPaymentMethod} 
        onSelect={setSelectedPaymentMethod} 
        onPay={handlePayment} 
      />

      <PaymentOption 
        label="Card" 
        value="CARD" 
        selected={selectedPaymentMethod} 
        onSelect={setSelectedPaymentMethod} 
        onPay={handlePayment} 
      />

      <PaymentOption 
        label="Wallet" 
        value="WALLET" 
        selected={selectedPaymentMethod} 
        onSelect={setSelectedPaymentMethod} 
        onPay={handlePayment} 
      />

      <PaymentOption 
        label="Pay Later" 
        value="Pay Later" 
        selected={selectedPaymentMethod} 
        onSelect={setSelectedPaymentMethod} 
        onPay={handlePayment} 
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
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardContainer: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  submitButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#034694',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default memo(TrueMads);

