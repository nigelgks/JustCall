import React, { useState } from 'react';
import { View,
         Text,
         TouchableOpacity,
         StyleSheet,
         TextInput,
         KeyboardAvoidingView,
         Platform,
         ScrollView
        } from 'react-native';

//Import APIs and router
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../supabase/supabase';

//Import vector icons
import { Ionicons } from '@expo/vector-icons';

const Register = () => {
  //Expo router navigation
  const router = useRouter();

  //Passed variables from previous page
  const { name } = useLocalSearchParams();
  
  //useState hooks
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
  };

  //Function to validate existing phone number in database
  const checkPhoneNum = async (phone) => {
    console.log(phone);

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .like('phone', phone);

    if (error) {
      console.log("Unable to search phone number: ", error);
      return null;
    } else if (data.length === 0) {
      //Proceed if phone number does not exist
      console.log('No phone found in database.');
      return data;
    } else {
      //Redirect user back to login page if phone number already exist in database
      console.log('Phone number already registered.');
      alert('Phone number already registered. Please login.');
      router.navigate('login');
      return data;
    };
  };

  return (
    <KeyboardAvoidingView 
      keyboardVerticalOffset={-500}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{flex: 1, paddingTop: 50}}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={{paddingLeft: 10}} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color='black'/>
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>Registration</Text> 

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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingLeft: 70,
    paddingRight: 70,
    paddingTop: 35,
    paddingBottom: 50
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 45,
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
  }
});

export default Register;