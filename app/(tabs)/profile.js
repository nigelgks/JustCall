import React, { useEffect, useState } from 'react';
import { View,
         Text,
         TouchableOpacity,
         ActivityIndicator,
         StyleSheet,
         TextInput,
         KeyboardAvoidingView,
         ScrollView
        } from 'react-native';
import { supabase } from '../../supabase/supabase';
import { useRouter } from 'expo-router';
import '@walletconnect/react-native-compat';
import { useWeb3ModalAccount } from '@web3modal/ethers-react-native';
import { AntDesign } from '@expo/vector-icons';

const profile = () => {
  const { address } = useWeb3ModalAccount();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      const {data} = await supabase.auth.getSession();
      if (!session) {
        setSession(data.session);
      };
    };

    if (session) {
      setEmail(session.user.email);
      setPhone(session.user.phone);
    } else {
      fetchSessionData();
    };
  }, [session]);

  useEffect(() => {
    const getName = async () => {
      const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .like('address', address);
    
      if (error) {
        console.log('Unable to fetch name: ', error);
      } else {
        setName(data[0].name);
      };
    };

    getName();
  }, [address]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setLoading(false);
      console.log("Signed out successfully.");
      alert("Signed out successfully.")
      router.replace('wallet');
    } catch (error) {
        console.log("Unable to sign out: ", error);
    };
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-500}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{flex: 1, paddingTop: 70}}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
              <AntDesign name="logout" size={25} color="black"/>
          </TouchableOpacity>
        </View>
        

        <View style={styles.container}>
          <Text style={styles.inputTitle}>NAME</Text>
          <TextInput
            style={[styles.input, {backgroundColor: 'lightgray'}]}
            placeholder={name}
            editable={false}
          />
          <Text style={styles.inputTitle}>PHONE NUMBER</Text>
          <TextInput
            style={[styles.input, {backgroundColor: 'lightgray'}]}
            placeholder={phone ? `+${phone}` : ''}
            editable={false}
          />
          <Text style={styles.inputTitle}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType='email-address'
          />
          <Text style={styles.inputTitle}>ADDRESS</Text>
          <TextInput
            style={[styles.input, {backgroundColor: 'lightgray'}]}
            placeholder={address}
            editable={false}
          />

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Confirm changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
          >
            <Text style={[styles.buttonText, {color: 'white'}]}>Delete account</Text>
          </TouchableOpacity>
          {loading ? <ActivityIndicator/> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
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
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    marginTop: 15
  },
  deleteButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default profile;