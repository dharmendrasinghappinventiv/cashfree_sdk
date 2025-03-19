import React, { memo ,useState,useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity ,TextInput,Alert} from 'react-native';
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

const BASE_RESPONSE_TEXT = 'Payment Status will be shown here.';

const PaymentCard = ({ onPress, selectedPaymentMethod, value }) => {

  const [responseText, setResponseText] = useState(BASE_RESPONSE_TEXT);

  const [upiID, setUpiID] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardExpiryMM: '',
    cardExpiryYY: '',
    cardCvv: '',
    saveCard: false,
  });

  // UseEffect for component mount and unmount
  useEffect(() => {
    console.log('MOUNTED');
    
    // Set up event subscriber
    CFPaymentGatewayService.setEventSubscriber({
      onReceivedEvent(eventName, map) {
        console.log('Event received on screen: ' + eventName + ' map: ' + JSON.stringify(map) );
      },
    });
    
    // Set up callback
    CFPaymentGatewayService.setCallback({
      onVerify(orderID) {
        console.log('CallBack Verify OrderId is :-' + orderID);
        updateStatus(orderID);
      },
      onError(error, orderID) {
        console.log('CallBack exception is :-- ' + JSON.stringify(error) + '\norderId is :' + orderID );
        updateStatus(JSON.stringify(error));
      },
    });
    
    // Cleanup on component unmount
    return () => {
      console.log('UNMOUNTED');
      CFPaymentGatewayService.removeCallback();
      CFPaymentGatewayService.removeEventSubscriber();
    };
  }, []);

  const updateStatus = (message) => {
    setResponseText(message)
  };


  const handlePaymentResponse = response => {
    console.log("Response:--",response);
  };

  const handleSubmitUPI = async () => {
    if(upiID === ''){
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID');
      return
    }
    const payment_session_id =
      'session_weRScfaHFFaZfI4VWc3BnSDXO5AMlw3d87s-92JnJCyAMRFSHHB8YeAbcITFFo73UdX_0DFbAolwjuKVgivqKxg6mzIx2yBMbmH4t6l7u4wRpB-HP2IBjjGNUApaymentpayment';
    const order_id = '2efa24edd29e';
    const details = {payment_session_id, order_id};

    try {
      // const apps = await CFPaymentGatewayService.getInstalledUpiApps();
      // console.log('Callback for Fetch UPI Apps :::==>' + apps);
      console.log('Initializing payment session...');
      const session = new CFSession(
        details.payment_session_id,
        details.order_id,
        CFEnvironment.SANDBOX,
      );
      console.log('Session:', session);
      
      const upi = new CFUPI(UPIMode.INTENT, upiID);
      const cfUpiPayment = new CFUPIPayment(session, upi);
      CFPaymentGatewayService.makePayment(cfUpiPayment);
      
      console.log('Payment gateway triggered');
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert('Payment Error', error.message || 'An error occurred while initiating payment' );
    }
  }


  const handleSubmitCard = async () => {
    const payment_session_id =
      'session_weRScfaHFFaZfI4VWc3BnSDXO5AMlw3d87s-92JnJCyAMRFSHHB8YeAbcITFFo73UdX_0DFbAolwjuKVgivqKxg6mzIx2yBMbmH4t6l7u4wRpB-HP2IBjjGNUApaymentpayment';
    const order_id = '2efa24edd29e';
    const details = {payment_session_id, order_id};

    try {
      const session = new CFSession(
        details.payment_session_id,
        details.order_id,
        CFEnvironment.SANDBOX,
      );
      console.log('Session created:', session);

      const card = new Card(
        cardDetails?.cardNumber,
        cardDetails?.cardHolderName,
        cardDetails?.cardExpiryMM,
        cardDetails?.cardExpiryYY,
        cardDetails?.cardCvv,
        cardDetails?.saveCard,
      );

      console.log('Card', JSON.stringify(card));
      const cardPayment = new CFCardPayment(session, card);
      CFPaymentGatewayService.makePayment(cardPayment);
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert('Payment Error',error.message || 'An error occurred while initiating payment');
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.checkBoxContainer}>
          <RadioButton
            value={value}
            status={selectedPaymentMethod === value ? 'checked' : 'unchecked'}
            onPress={onPress}
          />
        </View>
        <View style={styles.rightContainer}>
          {/* Display the card's value instead of selectedPaymentMethod */}
          <Text>{value}</Text>
        </View>
      </View>

      {/* UPI Details Section */}
      {value == 'UPI' && (
        <Collapsible collapsed={selectedPaymentMethod !== 'UPI'}>
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
      )}

      {/* Card Details Section */}
      {value == 'CARD' && (
        <Collapsible collapsed={selectedPaymentMethod !== 'CARD'}>
          <View style={styles.paymentForm}>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChangeText={text =>
                setCardDetails({...cardDetails, cardNumber: text})
              }
              placeholderTextColor={'#000'}
              keyboardType="numeric"
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

            <View style={[styles.rowContainer,{paddingHorizontal:5}]}>
              <View style={styles.rowLeft}>
                <TextInput
                  style={styles.input2}
                  placeholder="Expiry MM"
                  value={cardDetails.cardExpiryMM}
                  onChangeText={text =>
                    setCardDetails({...cardDetails, cardExpiryMM: text})
                  }
                  placeholderTextColor={'#000'}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input2}
                  placeholder="Expiry YY"
                  value={cardDetails.cardExpiryYY}
                  onChangeText={text =>
                    setCardDetails({...cardDetails, cardExpiryYY: text})
                  }
                  placeholderTextColor={'#000'}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.rowRight}>
                <TextInput
                  style={styles.input2}
                  placeholder="CVV"
                  value={cardDetails.cardCvv}
                  onChangeText={text =>
                    setCardDetails({...cardDetails, cardCvv: text})
                  }
                  placeholderTextColor={'#000'}
                  keyboardType="numeric"
                />
              </View>

            </View>
          </View>
        </Collapsible>
      )}

      <TouchableOpacity style={styles.submitButtonCss} onPress={value == 'UPI' ? handleSubmitUPI : handleSubmitCard}>
        <Text style={styles.titleCss}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(PaymentCard);

const styles = StyleSheet.create({
  container: {
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
  checkBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonCss: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#034694',
    marginTop: 10,
  },
  titleCss: {
    color: '#fff',
    fontSize: 16,
  },

  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    width:'95%',
    alignSelf:'center'
  },
  input2: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    width:'50%',
    alignSelf:'center'
  },
  rowLeft:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'55%'
  },
  rowRight:{
    paddingHorizontal:20,
    width:'60%'
  }

});
