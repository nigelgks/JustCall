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
import Octicons from '@expo/vector-icons/Octicons';

const profile = () => {
  const { address } = useWeb3ModalAccount();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailMatch, setEmailMatch] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const fetchSessionData = async () => {
      const {data} = await supabase.auth.getSession();
      if (!session) {
        setSession(data.session);
      };
    };

    if (session) {
      if (!session.user.email) {
        alert('Please confirm your email. Check your inbox.');
      };
      setEmail(session.user.email);
      setPhone(session.user.phone);
      setEmailConfirmed(session.user.email_confirmed_at);
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
    setNewEmail(text);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setLoading(false);
      console.log("Signed out successfully.");
      alert("Signed out successfully.");
      router.replace('wallet');
    } catch (error) {
        console.log("Unable to sign out: ", error);
    };
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-500}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity onPress={handleLogout}>
                <AntDesign name="logout" size={25} color="black"/>
            </TouchableOpacity>
          </View>

          <View style={[styles.verifyBox, {
            backgroundColor: (emailConfirmed) ? 'darkcyan' : 'orange'
          }]}>
            {emailConfirmed ? (
              <>
                <Octicons name="verified" size={24} color="white" />
                <Text style={[styles.verifyText, {color: 'white'}]}>Account verified.</Text>
              </>
            ) : (
              <>
                <Octicons name="unverified" size={24} color="black" />
                <Text style={styles.verifyText}>Account unverified.</Text>
              </>
            )}
          </View>

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
          <Text style={styles.inputTitle}>WALLET ADDRESS</Text>
          <TextInput
            style={[styles.input, {backgroundColor: 'lightgray'}]}
            placeholder={address}
            editable={false}
          />
          <Text style={styles.inputTitle}>EMAIL ADDRESS</Text>
          { emailMatch ? (
            null
          ) : <Text style={[styles.warnText, {color: 'red'}]}>Incorrect format.</Text>}
          <TextInput
            style={[styles.input, {
              borderColor: (emailConfirmed) ? 'gray' : 'darkred',
              borderWidth: (emailConfirmed) ? 1 : 2
            }]}
            placeholder={(emailConfirmed) ? email : 'Please confirm your email.'}
            value={newEmail}
            onChangeText={handleEmail}
            keyboardType='email-address'
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton,
              {
                borderColor: (!newEmail || newEmail === email || !emailMatch) ? 'gray' : 'black'
              }
            ]}
            disabled={!newEmail || newEmail === email || !emailMatch}
          >
            <Text style={[styles.buttonText,
              {
                color: (!newEmail || newEmail === email || !emailMatch) ? 'gray' : 'black'
              }
            ]}
            >Confirm changes</Text>
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
  mainContainer: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 25,
  },
  topContainer: {
    flex: 1,
    paddingBottom: 45
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  verifyBox: {
    height: 65,
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 1
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 8
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
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 25
  },
  warnText: {
    fontSize: 9,
    paddingBottom: 5
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8
  },
  deleteButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15
  }
});

export default profile;