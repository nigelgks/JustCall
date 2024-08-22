import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Login = () => {
  const x = 'abc';
  const y = '123';

  const [phoneNum, setPhoneNum] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = () => {
    if (y == phoneNum && x == password) {
      router.replace('keypad');
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
        onChangeText={(text) => setPhoneNum(text)}
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