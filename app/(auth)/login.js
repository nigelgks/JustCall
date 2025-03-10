import React, { useEffect, useState } from 'react';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
         StyleSheet,
         Modal,
         ActivityIndicator
        } from 'react-native';

//Import APIs and router
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase/supabase';
import { ethers, BrowserProvider } from 'ethers';
import '@walletconnect/react-native-compat';
import { useAppKitAccount,
         useAppKitProvider
       } from '@reown/appkit-ethers-react-native';

//Setup contract ABI and address
const contract = require("../../artifacts/contracts/JustCall.sol/JustCall.json");
const abi = contract.abi;
const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDR;

const Login = () => {
  //Get wallet connection status and provider
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  //Expo router navigation
  const router = useRouter();

  //useState hooks
  const [phoneNum, setPhoneNum] = useState('+60 ');
  const [phoneFormat, setPhoneFormat] = useState(false);
  const [phoneLength, setPhoneLength] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  //Redirect user to main page if session exist
  useEffect(() => {
    if (session) {
      console.log('Login successful. Redirecting to main page.');
      router.replace('keypad');
    };
  }, [session]);

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

  //Function to re-format phone number
  const formatNum = (num) => {
    newNum = num.replace(/\s+/g, "");

    if (newNum[3] == '0') {
      return (newNum.slice(0,3) + newNum.slice(4));
    };
    
    return newNum;
  };

  //Function to handle login operation
  const handleLogin = async () => {
    setLoading(true);

    const {data, profile} = await checkAddress(address, false);
    const supabaseData = data;

    //Proceed login with password if wallet address already registered in Blockchain
    if (profile != null) {
      const formattedNum = formatNum(phoneNum);
  
      const {error} = await supabase.auth.signInWithPassword({
        phone: formattedNum,
        password
      });

      if (error) {
        console.log("[LOGIN] Unable to login: ", error);
        
        if (error.message.includes('Invalid login credentials')) {
          alert('Invalid login credentials.');
        };
      } else {
        //Fetch session after login
        const {data} = await supabase.auth.getSession();
        console.log(data)

        //Append data if required
        if (supabaseData == null) {
          const addData = {
            id: data.session.user.id,
            name,
            address,
            phone: formattedNum
          };
          
          const {error} = await supabase
            .from('accounts')
            .insert([addData])
            .select();
          
          if (error) {
            console.log('[LOGIN] Unable to update user table:', error);
            alert('Error encountered. Please try again.');
          } else {
            console.log('[LOGIN] User table updated.');
          };
        };

        setSession(data.session);
      };

      setPhoneNum('+60 ');
      setPassword('');
    };

    setLoading(false);
  };

  //Function to handle registration operation
  const handleRegister = async () => {
    setLoading(true);

    const {data, profile} = await checkAddress(address, true);

    if (profile == null) {
      if (data == null) {
        //Proceed registration if wallet address is not registered
        router.navigate('identification');
      } else {
        //Show alert if wallet address is already registered
        alert(`User wallet [${address}] is already registered. Please log in.`);
      };
    };

    setLoading(false);
  };

  //Function to navigate to OTP verification page
  const handleOTP = async () => {
    setLoading(true);

    const {data, profile} = await checkAddress(address, false);

    //Proceed login with OTP if wallet address already registered in Blockchain
    if (profile != null) {
      const formattedNum = formatNum(phoneNum);
      const signIn = true;
      
      const profile = {
        signIn,
        phoneNum: formattedNum,
        name,
        append: (data == null) ? true : false
      };
      
      router.navigate({
        pathname: 'verification',
        params: profile
      });

      setPhoneNum('+60 ');
      setPassword('');
    };

    setLoading(false);
  };

  //Check whether wallet address already exist in database
  const checkAddress = async (addr, register) => {
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const justCall = new ethers.Contract(contractAddress, abi, signer);

    try {
      const profile = await justCall.getUserByAddress();
      console.log("[LOGIN] Profile: ", profile);
      setName(profile[0]);

      const { data } = await supabase
      .from('accounts')
      .select('*')
      .like('address', addr);

      if (data.length === 0) {
        //Address does not exist in database
        console.log('[LOGIN] No address found in Supabase.');

        return {
          data: null,
          profile
        };

      } else {
        //Address already exist in database
        console.log('[LOGIN] Address found in database:', data);

        if (data[0].phone != profile[1]) {
          // Mismatching number, redirect back to wallet page
          console.log('[LOGIN] Mismatched phone number:', data[0].phone, '!=', profile[1]);
          alert('Mismatched phone number linked to connected wallet address.');
          router.back();
        } else {
          // Proceed login or OTP
          return {
            data,
            profile
          };
        };
      };

    } catch (error) {

      // User not registered in Blockchain
      if (error.message.includes('User does not exist.')) {
        if (register == false) {
          // If login, redirect back to wallet
          console.log('[LOGIN] User does not exist in Blockchain.');
          alert('No user is registered with this address. Please select another wallet or register.');
        };
      } else {
        // Other errors
        console.log('[LOGIN] Error fetching address:', error);
        alert('Error fetching address:', error);
      };
    };

    return {
      data: null,
      profile: null
    };
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>Login</Text>
      <Text style={styles.desc}>Sign in to continue.</Text>

      <Text style={styles.inputTitle}>PHONE NUMBER</Text>
      { !phoneFormat ? (
        null
      ) : <Text style={[styles.warnText, {color: 'red'}]}>Numerical characters only</Text>}
      { !phoneLength ? (
        null
      ) : <Text style={[styles.warnText, {color: 'darkred'}]}>Minimum 13 characters</Text>}
      <TextInput
        style={styles.input}
        value={phoneNum}
        onChangeText={handleChange}
        keyboardType='number-pad'
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
        style={[styles.loginButton, {
          backgroundColor: (!phoneNum || !password || phoneFormat || phoneLength) ?
                 'darkgray' : 'black'
        }]}
        onPress={handleLogin}
        disabled={!phoneNum || !password || phoneFormat || phoneLength}
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
        disabled={!phoneNum || phoneNum == '+60 ' || phoneFormat || phoneLength}
      >
        <Text style={[styles.otpText, {
          color: (!phoneNum || phoneNum == '+60 ' || phoneFormat || phoneLength) ?
                 'lightsteelblue' : 'royalblue'
        }]}>
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
  warnText: {
    fontSize: 9,
    paddingBottom: 5
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
    fontWeight: '500', 
    fontSize: 15
  }
});

export default Login;