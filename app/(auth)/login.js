import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Login = () => {
  const x = '+600198781785';
  const y = '12345678';

  const [phoneNum, setPhoneNum] = useState('+60');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleChange = (text) => {
    if (text.startsWith('+60') && text.length <= 14) {
      setPhoneNum(text);
    };
  };

  const handleLogin = () => {
    if (phoneNum[3] == '1') {
      formattedNum = phoneNum.slice(0,3) + '0' + phoneNum.slice(3);
    } else {
      formattedNum = phoneNum;
    };

    if (x == formattedNum && y == password) {
      const profile = {
        phoneNum: formattedNum,
        password
      };
      
      router.navigate({
        pathname: 'verification',
        params: profile
      });
    } else {
      router.navigate('register');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.desc}>Sign in to continue.</Text>

      <Text style={styles.inputTitle}>PHONE NUMBER</Text>
      <TextInput
        style={styles.input}
        placeholder='Phone number'
        value={phoneNum}
        onChangeText={handleChange}
        keyboardType='phone-pad'
      />
      <Text style={styles.inputTitle}>PASSWORD</Text>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={!phoneNum || !password}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 70
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    alignSelf: 'center'
  },
  desc: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    marginBottom: 30,
    alignSelf: 'center'
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    marginBottom: 10,
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

export default Login;