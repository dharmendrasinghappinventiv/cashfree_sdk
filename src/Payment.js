import React, {memo, useState} from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet} from 'react-native';
import {
  CFCallback,
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const generateOrderId = amount => {
    return `order_${new Date().getTime()}_${amount}_${Math.floor(
      Math.random() * 1000,
    )}`;
  };

  const generateOrderToken = amount => {
    return `token_${Math.random().toString(36).substring(2)}_${amount}`;
  };

  // Handle payment response
  const handlePaymentResponse = response => {
    console.log('Payment Response:', response);
    if (response && response.status) {
      if (response.status === 'SUCCESS') {
        setPaymentStatus('Payment Successful!');
      } else if (response.status === 'FAILED') {
        setPaymentStatus('Payment Failed!');
      } else {
        setPaymentStatus('Payment Pending...');
      }
    } else {
      setPaymentStatus('Invalid response from payment gateway');
    }
  };

  const handlePayment = async () => {
    if (amount && !isNaN(amount) && Number(amount) > 0) {
      // Order ID and session ID both are comming form backend
      // const payment_session_id =
      //   'session_Gpx8dbqf3FCTyVDtRGfuXM4e1i6eTQCKSbIcD7VVlhNbnLsa0iCheBom3Hba3BIHTuIc5WCKYb9eXs3hKjz-imdh5W4aeX5kUCPmQ3JRNv__gpcgI4eDy3yFTgpaymentpayment';
      // const order_id = 'bb411895a28e';
      const payment_session_id =
        'session_weRScfaHFFaZfI4VWc3BnSDXO5AMlw3d87s-92JnJCyAMRFSHHB8YeAbcITFFo73UdX_0DFbAolwjuKVgivqKxg6mzIx2yBMbmH4t6l7u4wRpB-HP2IBjjGNUApaymentpayment';
      const order_id = '2efa24edd29e';
      const details = {payment_session_id, order_id, amount};
      setOrderDetails(details);

      try {
        // Create the session for Cashfree payment
        const session = new CFSession(
          details.payment_session_id,
          details.order_id,
          CFEnvironment.SANDBOX,
        );

        console.log('Session:', session);

        // Set up theme for the checkout UI
        const theme = new CFThemeBuilder()
          .setNavigationBarBackgroundColor('#E64A19')
          .setNavigationBarTextColor('#FFFFFF')
          .setButtonBackgroundColor('#FFC107')
          .setButtonTextColor('#FFFFFF')
          .setPrimaryTextColor('#212121')
          .setSecondaryTextColor('#757575')
          .build();

        // Create the payment object
        const dropPayment = new CFDropCheckoutPayment(session, null, theme);
        console.log('Drop payment initialized:', JSON.stringify(dropPayment));
        // CFPaymentGatewayService.doUPIPayment( dropPayment,handlePaymentResponse); // Open UPI payment direct only

        // Trigger the payment gateway
        CFPaymentGatewayService.doPayment(dropPayment, handlePaymentResponse);

        console.log('Payment gateway triggered');
      } catch (error) {
        console.error('Payment error:', error);
        Alert.alert(
          'Payment Error',
          'An error occurred while initiating payment',
        );
      }
    } else {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        React native Cash free Payment Gateway POC
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholderTextColor={'#000'}
      />
      <Button title="Pay" onPress={handlePayment} />

      {orderDetails && (
        <View style={styles.orderDetails}>
          <Text>Payment Session ID: {orderDetails.payment_session_id}</Text>
          <Text>Order ID: {orderDetails.order_id}</Text>
          <Text>Amount: ₹{orderDetails.amount}</Text>
        </View>
      )}

      {paymentStatus && (
        <View style={styles.paymentStatus}>
          <Text>{paymentStatus}</Text>
        </View>
      )}
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  orderDetails: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentStatus: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
  },
});

export default memo(Payment);
