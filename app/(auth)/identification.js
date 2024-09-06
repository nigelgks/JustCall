import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const identification = () => {
  const router = useRouter();

  const handleValidation = () => {
    router.navigate('register');
  };

  return (
    <View style={{flex: 1, paddingTop: 50}}>
      <TouchableOpacity style={{paddingLeft: 10}} onPress={() => router.navigate('login')}>
        <Ionicons name="arrow-back-circle" size={40} color='black'/>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>NRIC Validation</Text>
        <Text style={styles.desc}>Make sure your lens are clean.</Text>

        <Text style={styles.inputTitle}>FRONT NRIC</Text>
        <TouchableOpacity
          style={styles.nricBox}
        >
          <Feather name="camera" size={30} color="black" />
        </TouchableOpacity>

        <Text style={styles.inputTitle}>BACK NRIC</Text>
        <TouchableOpacity
          style={styles.nricBox}
        >
          <Feather name="camera" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleValidation}
        >
          <Text style={styles.buttonText}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 70,
    paddingRight: 70,
    paddingBottom: 70
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center'
  },
  desc: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    marginBottom: 30,
    alignSelf: 'center',
    textAlign: 'center'
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    textAlign: 'left'
  },
  nricBox: {
    width: '100%',
    height: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
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

export default identification;