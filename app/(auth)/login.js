import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../supabase/supabase';
import '@walletconnect/react-native-compat';
import { useWeb3ModalAccount } from '@web3modal/ethers-react-native';

const Login = () => {
  const { address } = useWeb3ModalAccount();

  const [phoneNum, setPhoneNum] = useState('+60');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log('Login successful. Redirecting to main page.');
      router.replace('keypad');
    };
  }, [session]);

  const handleChange = (text) => {
    if (text.startsWith('+60') && text.length <= 14) {
      setPhoneNum(text);
    };
  };

  const formatNum = (num) => {
    if (num[3] == '1') {
      return (num.slice(0,3) + '0' + num.slice(3));
    };
    
    return num;
  };

  const handleLogin = async () => {
    const data = await checkAddress(address, false);

    if (data != null && data.length > 0) {
      const formattedNum = formatNum(phoneNum);

      const {error} = await supabase.auth.signInWithPassword({
          phone: formattedNum,
          password
      });

      if (error) {
        console.log("Unable to login: ", error);
        
        if (error.message.includes('Invalid login credentials')) {
          alert('Invalid login credentials.');
        };
      };

      const {data} = await supabase.auth.getSession();
      setSession(data.session);
      setPhoneNum('+60');
      setPassword('');
    };
  };

  const handleRegister = async () => {
    const data = await checkAddress(address, true);

    if (data.length === 0) {
      router.navigate('identification');
    } else if (data.length > 0) {
      alert(`User wallet [${address}] is already registered. Please log in.`);
    };
  };

  const handleOTP = async () => {
    const data = await checkAddress(address, false);

    if (data != null && data.length > 0) {
      const formattedNum = formatNum(phoneNum);

      const signIn = true;
      
      const profile = {
        signIn,
        phoneNum: formattedNum
      };
      
      router.navigate({
        pathname: 'verification',
        params: profile
      });

      setPhoneNum('+60');
      setPassword('');
    };
  };

  const checkAddress = async (addr, register) => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .like('address', addr);

    if (error) {
      console.log("Unable to search address: ", error);
      return null;
    } else if (data.length === 0) {
      console.log('No address found in database.');
      if (register == false) {
        alert('Address does not exist in database. Please select another wallet.');
        router.back();
      };
      return data;
    } else {
      console.log('Address found in database:', data);
      return data;
    };
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
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={!phoneNum || !password}
      >
        <Text style={styles.loginText}>
          Login with password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.registerText}>
          Sign up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.otpButton}
        onPress={handleOTP}
        disabled={!phoneNum || !password}
      >
        <Text style={styles.otpText}>
          Login with OTP instead
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
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
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 30,
  },
  otpButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    alignSelf: 'center'
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  otpText: {
    textAlign: 'center', 
    color: 'royalblue', 
    fontWeight: '500', 
    fontSize: 15
  }
});

export default Login;