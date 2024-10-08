import React, { useState } from 'react';
import { View,
         Text,
         TouchableOpacity,
         StyleSheet,
         TextInput,
         KeyboardAvoidingView,
         Platform,
         ScrollView,
         Modal,
         ActivityIndicator
        } from 'react-native';

//Import APIs and router
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../supabase/supabase';
import { ethers, BrowserProvider } from 'ethers';
import '@walletconnect/react-native-compat';
import { useAppKitProvider } from '@reown/appkit-ethers-react-native';

//Setup contract ABI and address
const contract = require("../../artifacts/contracts/JustCall.sol/JustCall.json");
const abi = contract.abi;
const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDR;

const Register = () => {
  //Get wallet provider
  const { walletProvider } = useAppKitProvider();

  //Expo router navigation
  const router = useRouter();

  //Passed variables from previous page
  const { name } = useLocalSearchParams();
  
  //useState hooks
  const [loading, setLoading] = useState(false);
  const [phoneNum, setPhoneNum] = useState('+60 ');
  const [phoneFormat, setPhoneFormat] = useState(false);
  const [phoneLength, setPhoneLength] = useState(false);
  const [email, setEmail] = useState('');
  const [emailMatch, setEmailMatch] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  //Set email format
  const emailFormat = /^[^\s@]+@[^\s@]+\.com$/;

  //Function to manage phone number format
  const handleChange = (text) => {
    //Detect non-numerical characters
    str = text.slice(4).match(/\D/g);

    if (str) {
      setPhoneFormat(true);
    } else {
      setPhoneFormat(false);
    };

    //Manage phone number format
    if (text.startsWith('+60 ') && text.length <= 14) {
      setPhoneNum(text);
    };

    //Manage phone number length
    if (text.length < 13) {
      setPhoneLength(true);
    } else {
      setPhoneLength(false);
    };
  };

  //Function to manage email format
  const handleEmail = (text) => {
    if (emailFormat.test(text)) {
      setEmailMatch(true);
    } else {
      if (text.length > 0) {
        setEmailMatch(false);
      } else {
        setEmailMatch(true);
      };
    };
    setEmail(text);
  };

  //Function to manage password minimum length
  const handlePassword = (text) => {
    if (text.length > 0 && text.length < 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    };
    setPassword(text);
  };

  //Function to confirm password similarity
  const handleConfirmPassword = (text) => {
    if (text.length > 0 && text == password && password.length > 0) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    };
    setConfirmedPassword(text);
  };

  //Function to manage next button
  const handleButtonPress = async () => {
    setLoading(true);

    //Re-format phone number
    newNum = phoneNum.replace(/\s+/g, "");

    if (newNum[3] == '0') {
      formattedNum = newNum.slice(0,3) + newNum.slice(4);
    } else {
      formattedNum = newNum;
    };

    //Validate registered phone numbers
    const data = await checkPhoneNum(formattedNum);

    console.log(data);

    //Navigate user to verification page if phone number does not exist
    if (data.length == 0) {
      const signIn = false;
      
      const profile = {
        signIn,
        name,
        phoneNum: formattedNum,
        email,
        password
      };
  
      router.navigate({
        pathname: 'verification',
        params: profile
      });
    };

    setLoading(false);
  };

  //Function to validate existing phone number in database
  const checkPhoneNum = async (phone) => {
    console.log(phone);

    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const justCall = new ethers.Contract(contractAddress, abi, signer);

    try {
      //Fetch phone number from blockchain
      const profilePhone = await justCall.getUserByPhoneNumber(phone);
      console.log("User: ", profilePhone);

      //Second stage check database
      const { data } = await supabase
      .from('accounts')
      .select('*')
      .like('phone', phone);

      if (data.length === 0) {
        //Mismatched data exist
        console.log('Warning: Mismatched data exist!');
        alert('Warning: Mismatched data exist!');
      } else {
        //Phone number already exist in database and blockchain
        console.log('Phone number already registered.');
        alert('Phone number already registered. Please login.');
      };

      //Redirect user back to login page
      router.navigate('login');
      return null;
    } catch (error) {
      if (error.message.includes('Invalid phone number length.')) {
        console.log('Invalid phone number length.');
        alert('Invalid phone number length. Make sure it follows the correct format.');
        return null;
      } else if (error.message.includes('Phone number is not registered')) {
        //Second stage check database
        const { data } = await supabase
        .from('accounts')
        .select('*')
        .like('phone', phone);

        if (data.length === 0) {
          //Proceed if phone number does not exist
          console.log('Phone number is not registered');
          return data;
        } else {
          //Redirect user back to login page if mismatched data exist
          console.log('Warning: Mismatched data exist!');
          alert('Warning: Mismatched data exist!');
          router.navigate('login');
          return data;
        };
      } else {
        console.log('Error fetching phone number:', error);
        return null;
      };
    };
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-500}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{paddingTop: 50}}
    >
      {loading && (
        <Modal
          transparent={true}
          animationType='fade'
          visible={loading}
          onRequestClose={() => setLoading(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size='large' color='white'/>
              <Text style={{color: 'white', fontWeight: '400'}}>Loading...</Text>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Registration</Text> 
          <Text style={styles.desc}>Please ensure your name below is correct. Scan again if it is incorrect.</Text>

          <Text style={styles.inputTitle}>FULL NAME</Text>
          <TextInput
            style={[styles.input, {backgroundColor: 'lightgray'}]}
            placeholder={name}
            editable={false}
          />
          <Text style={styles.inputTitle}>PHONE NUMBER</Text>
          { !phoneFormat ? (
            null
          ) : <Text style={[styles.warnText, {color: 'red'}]}>Numerical characters only</Text>}
          { !phoneLength ? (
            null
          ) : <Text style={[styles.warnText, {color: 'red'}]}>Minimum 13 characters</Text>}
          <TextInput
            style={styles.input}
            value={phoneNum}
            onChangeText={handleChange}
            keyboardType='phone-pad'
          />
          <Text style={styles.inputTitle}>EMAIL</Text>
          { emailMatch ? (
            null
          ) : <Text style={[styles.warnText, {color: 'red'}]}>Incorrect format.</Text>}
          <TextInput
            style={styles.input}
            value={email}
            placeholder='Email address'
            onChangeText={handleEmail}
            keyboardType='email-address'
          />
          <Text style={styles.inputTitle}>PASSWORD</Text>
          { passwordLength ? (
            <Text style={[styles.warnText, {color: 'red'}]}>
              Password must have 8 characters.
            </Text>
          ) : null}
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={handlePassword}
          />
          <Text style={styles.inputTitle}>CONFIRM PASSWORD</Text>
          { passwordMatch ? (
            <Text style={[styles.warnText, {color: 'green'}]}>Password matched.</Text>
          ) : null}
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            placeholder="Password"
            secureTextEntry={true}
            value={confirmedPassword}
            onChangeText={handleConfirmPassword}
          />
          <TouchableOpacity
            style={[styles.button, {
              backgroundColor: 
                (!phoneNum || !password || !confirmedPassword || !emailMatch || !email || !passwordMatch) ?
                'gray' :
                'black'
            }]}
            onPress={handleButtonPress}
            disabled={!phoneNum || !password || !confirmedPassword || !emailMatch || !passwordMatch}
          >
            <Text style={styles.buttonText}>
              Next
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pressable}
            onPress={() => router.back()}
          >
            <Text style={{fontSize: 15, fontWeight: '500', textAlign: 'center', color: 'royalblue'}}>
              Incorrect Name? Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  loadingWrapper: {
      backgroundColor: 'black',
      height: 100,
      width: 100,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: 55,
    paddingBottom: 25
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    alignSelf: 'center'
  },
  desc: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    color: 'black',
    marginBottom: 30,
    alignSelf: 'center'
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    marginBottom: 3,
    textAlign: 'left'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15
  },
  warnText: {
    fontSize: 9,
    paddingBottom: 5
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  pressable: {
      width: '100%',
      marginTop: 25,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      alignSelf: 'center'
  },
});

export default Register;