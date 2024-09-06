import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const keypad = () => {
  const [input, setInput] = useState('');

  const handlePress = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const handleDelete = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.input}>{input}</Text>

      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <TouchableOpacity
            key={key} 
            style={styles.key}
            onPress={() => handlePress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleClear}
          disabled={input == ''}
        >
          {input == '' ? null : <Ionicons name="trash-outline" size={30} color="black" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
        >
          <Ionicons name="call-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleDelete}
          disabled={input == ''}
        >
          {input == '' ? null : <Ionicons name="backspace-outline" size={30} color="black" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 100
  },
  input: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300
  },
  key: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 2,
    backgroundColor: 'transparent',
    borderRadius: 40,
  },
  keyText: {
    fontSize: 40,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center'
  },
  controlButton: {
    padding: 15,
    margin: 15,
    backgroundColor: 'transparent',
    borderRadius: 40,
  },
  callButton: {
    padding: 15,
    margin: 25,
    backgroundColor: 'transparent',
    borderRadius: 40,
    borderWidth: 2,
    alignContent: 'center'
  },
  controlText: {
    fontSize: 18,
    color: 'white',
  },
});

export default keypad;