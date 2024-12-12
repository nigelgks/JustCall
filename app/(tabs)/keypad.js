import React, { useEffect, useState } from 'react';
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         PermissionsAndroid,
         Platform,
         Linking
        } from 'react-native';

//Import vector icons
import Ionicons from '@expo/vector-icons/Ionicons';

//Import wallet provider
import { useAppKitProvider } from '@reown/appkit-ethers-react-native';

const keypad = () => {
  //useState hooks
  const [input, setInput] = useState('');

  //Get wallet provider
  const { walletProvider } = useAppKitProvider();

  //Request call permission at first render
  useEffect(() => {
    //Function to manage access permission to call
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: 'Phone Call Permission',
              message: 'JustCall needs access to make phone calls.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Phone call permission allowed.');
          } else {
            console.log('Phone call permission denied.');
          };
        } catch (error) {
          console.log(error);
        };
      };
    };
    requestPermission();
  }, []);

  //Function to add number pressed into the input box
  const handlePress = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  //Function to backspace input
  const handleDelete = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  //Function to clear all input
  const handleClear = () => {
    setInput('');
  };

  const handleCall = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${input}`);
    };
    handleClear();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.input}>{input}</Text>

      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <TouchableOpacity
            key={key} 
            style={styles.key}
            onPress={() => handlePress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleClear}
          disabled={input == ''}
        >
          {input == '' ? null : <Ionicons name="trash-outline" size={30} color="black"/>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.callButton, {borderColor: (input == '') ? 'gray' : 'black'}]}
          onPress={handleCall}
          disabled={input == ''}
        >
          {input == '' ? 
            <Ionicons name="call-outline" size={30} color="gray"/> : 
            <Ionicons name="call-outline" size={30} color="black"/>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleDelete}
          disabled={input == ''}
        >
          {input == '' ? null : <Ionicons name="backspace-outline" size={30} color="black"/>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 30
  },
  input: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300
  },
  key: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 2,
    backgroundColor: 'transparent',
    borderRadius: 40,
  },
  keyText: {
    fontSize: 40,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center'
  },
  controlButton: {
    padding: 15,
    margin: 15,
    backgroundColor: 'transparent',
    borderRadius: 40,
  },
  callButton: {
    padding: 15,
    margin: 25,
    backgroundColor: 'transparent',
    borderRadius: 40,
    borderWidth: 2,
    alignContent: 'center'
  },
  controlText: {
    fontSize: 18,
    color: 'white',
  },
});

export default keypad;