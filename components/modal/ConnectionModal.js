import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const ConnectionModal = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe(); // Cleanup the event listener on unmount
  }, []);

  return (
    <Modal
      visible={isOffline}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>No Internet Connection</Text>
          <TouchableOpacity
            onPress={() => {
              NetInfo.fetch().then(state => {
                setIsOffline(!state.isConnected);
              });
            }}
          >
            <Text style={styles.button}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 17,
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'black',
    color: 'white',
    padding: 5,
    borderRadius: 10,
    width: 100,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default ConnectionModal;
