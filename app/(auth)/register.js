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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Register = () => {
  const [phoneNum, setPhoneNum] = useState('+60');
  const [email, setEmail] = useState('');
  const [emailMatch, setEmailMatch] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const router = useRouter();

  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (text) => {
    if (text.startsWith('+60') && text.length <= 14) {
      setPhoneNum(text);
    };
  };

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

  const handlePassword = (text) => {
    if (text.length > 0 && text.length < 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    };
    setPassword(text);
  };

  const handleConfirmPassword = (text) => {
    if (text.length > 0 && text == password && password.length > 0) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    };
    setConfirmedPassword(text);
  };

  const handleButtonPress = () => {
    if (phoneNum[3] == '1') {
      formattedNum = phoneNum.slice(0,3) + '0' + phoneNum.slice(3);
    } else {
      formattedNum = phoneNum;
    };

    const signIn = false;
    
    const profile = {
      signIn,
      phoneNum: formattedNum,
      email,
      password
    };

    router.navigate({
      pathname: 'verification',
      params: profile
    });
  };

  return (
    <KeyboardAvoidingView 
      keyboardVerticalOffset={-500}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{flex: 1, paddingTop: 50}}
    >
      <ScrollView>
        <TouchableOpacity style={{paddingLeft: 10}} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color='black'/>
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>Registration</Text> 

          <Text style={styles.inputTitle}>PHONE NUMBER</Text>
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
            style={styles.button}
            onPress={handleButtonPress}
            disabled={!phoneNum || !password || !confirmedPassword}
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
    backgroundColor: 'black',
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