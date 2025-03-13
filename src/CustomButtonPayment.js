import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  CFCardPayment,
  // CFUPIPayment,
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
  CFUPI,
} from 'cashfree-pg-api-contract';

const CustomButtonPayment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isUPIVisible, setIsUPIVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [upiID, setUpiID] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardExpiryMM: '',
    cardExpiryYY: '',
    cardCvv: '',
    saveCard: false,
  });

  useEffect(() => {
    // Test if the SDK is initialized
    console.log(
      'Checking if CFPaymentGatewayService exists:',
      !!CFPaymentGatewayService,
    );
  }, []);

  const handlePaymentResponse = response => {
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

  const handlePaymentMethodSelection = method => {
    setSelectedPaymentMethod(method);
    if (method === 'UPI') {
      setIsUPIVisible(true);
      setIsCardVisible(false);
    } else if (method === 'CARD') {
      setIsCardVisible(true);
      setIsUPIVisible(false);
    }
  };

  const handleSubmit = async () => {
    const payment_session_id =
      'session_weRScfaHFFaZfI4VWc3BnSDXO5AMlw3d87s-92JnJCyAMRFSHHB8YeAbcITFFo73UdX_0DFbAolwjuKVgivqKxg6mzIx2yBMbmH4t6l7u4wRpB-HP2IBjjGNUApaymentpayment';
    const order_id = '2efa24edd29e';
    const details = {payment_session_id, order_id};

    try {
      console.log('Initializing payment session...');
      const session = new CFSession(
        details.payment_session_id,
        details.order_id,
        CFEnvironment.SANDBOX,
      );
      console.log('Session created:', session);

      if (selectedPaymentMethod === 'CARD') {
        console.log('Preparing card payment...');
        const cardPayment = new CFCardPayment(
          session,
          {
            cardNumber: cardDetails.cardNumber,
            cardHolderName: cardDetails.cardHolderName,
            cardExpiryMM: cardDetails.cardExpiryMM,
            cardExpiryYY: cardDetails.cardExpiryYY,
            cardCvv: cardDetails.cardCvv,
            saveCard: cardDetails.saveCard,
          },
          null,
        );
        console.log('Card payment object created');

        console.log('Triggering payment gateway...');
        CFPaymentGatewayService.doPayment(cardPayment, response => {
          console.log('Card payment response:', response);
          handlePaymentResponse(response);
        });
      } else if (selectedPaymentMethod === 'UPI') {
        console.log('Preparing UPI payment...');
        // For UPI, specify COLLECT or INTENT as the third parameter
        const upiPayment = new CFUPI(session, upiID, 'COLLECT');
        console.log('UPI payment object created', upiPayment);

        console.log('Triggering UPI payment...');
        CFPaymentGatewayService.doPayment(upiPayment, response => {
          console.log('UPI payment response:', response);
          handlePaymentResponse(response);
        });
      } else {
        Alert.alert('Error', 'Please select a payment method');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert(
        'Payment Error',
        error.message || 'An error occurred while initiating payment',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Custom Payment with Cashfree</Text>
      <Text style={styles.header}>{selectedPaymentMethod}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Pay with UPI"
          onPress={() => handlePaymentMethodSelection('UPI')}
        />
        <Button
          title="Pay with Card"
          onPress={() => handlePaymentMethodSelection('CARD')}
        />
      </View>

      {/* UPI Details Section */}
      <Collapsible collapsed={!isUPIVisible}>
        <View style={styles.paymentForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter UPI ID"
            value={upiID}
            onChangeText={setUpiID}
            placeholderTextColor={'#000'}
          />
        </View>
      </Collapsible>

      {/* Card Details Section */}
      <Collapsible collapsed={!isCardVisible}>
        <View style={styles.paymentForm}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChangeText={text =>
              setCardDetails({...cardDetails, cardNumber: text})
            }
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
            value={cardDetails.cardHolderName}
            onChangeText={text =>
              setCardDetails({...cardDetails, cardHolderName: text})
            }
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry MM"
            value={cardDetails.cardExpiryMM}
            onChangeText={text =>
              setCardDetails({...cardDetails, cardExpiryMM: text})
            }
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry YY"
            value={cardDetails.cardExpiryYY}
            onChangeText={text =>
              setCardDetails({...cardDetails, cardExpiryYY: text})
            }
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={cardDetails.cardCvv}
            onChangeText={text =>
              setCardDetails({...cardDetails, cardCvv: text})
            }
            placeholderTextColor={'#000'}
            keyboardType="numeric"
          />
        </View>
      </Collapsible>

      <Button title="Submit Payment" onPress={handleSubmit} />

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
