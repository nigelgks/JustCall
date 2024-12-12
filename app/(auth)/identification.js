import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

//Import API and Expo router
import { useRouter } from 'expo-router';

//Import vector icons
import Feather from '@expo/vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const identification = () => {
  //Expo router navigation
  const router = useRouter();

  //useState hooks
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(0);
  const [cameraRef, setCameraRef] = useState(null);
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [frontTicket, setFrontTicket] = useState('');
  const [backTicket, setBackTicket] = useState('');
  const [token, setToken] = useState('');

  //Fetch camera permission and env variable
  const [permission, requestPermission] = useCameraPermissions();
  const formURL = process.env.EXPO_PUBLIC_ANYFORM_KYC;

  //Manage token
  useEffect(() => {
    const formData = new URLSearchParams();
    const password = 'Test123';

    if (!token) {
      formData.append('apiPsw', password);

      fetch(`${formURL}/requestToken`, {
        method:'POST',
        body: formData.toString()
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response)
          throw new Error('Request failed with status', response.status);
        };
      })
      .then(data => {
        console.log('Success:', data);
        setToken(data.token);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
  }, []);

  //Function to open camera and capture image
  const openCamera = async (text) => {
    //Request camera permission
    if (!permission.granted) {
      try {
        requestPermission();
      } catch (error) {
        console.log("Error encountered", error)
      };
      alert('Permission denied. We need camera permission to proceed.');
      setOpen(0);
    } else {
      setOpen(1);

      if (text == 'front') {
        setFront(true);
        setBack(false);
      } else {
        setFront(false);
        setBack(true);
      };
    };
  };

  //Function to handle image capture
  const captureImage = async () => {
    if (cameraRef) {
      setLoading(true);

      const image = await cameraRef.takePictureAsync();

      setFront(false);
      setBack(false);
      setOpen(false);

      let formData = new FormData();
      formData.append('token', token);
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'ic.jpg'
      });

      try {
        const response = await fetch(`${formURL}/upload`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);

          if (data.result == 0) {
            if (front) {
              setFrontTicket(data.ticket);
            };
            if (back) {
              setBackTicket(data.ticket);
            };
            
          } else {
            alert('Unable to verify. Please try again.');
          };

        } else {
          console.error('Error:', response.status);
        };
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      };

      setLoading(false);
    };
  };

  //Function to handle next button
  const handleValidation = async () => {
    let frontFormData = new FormData();
    frontFormData.append('token', token);
    frontFormData.append('ticket', frontTicket);

    let backFormData = new FormData();
    backFormData.append('token', token);
    backFormData.append('ticket', frontTicket);

    try {
      const responseFront = await fetch(`${formURL}/check`, {
        method: 'POST',
        body: frontFormData
      });

      const responseBack = await fetch(`${formURL}/check`, {
        method: 'POST',
        body: backFormData
      });

      if (responseFront.ok && responseBack.ok) {
        const dataFront = await responseFront.json();
        const dataBack = await responseBack.json();
        const icFront = dataFront.pageList[0].photoList[0].result[0].text;
        const name = dataFront.pageList[0].photoList[0].result[1].text;
        const icBack = dataBack.pageList[0].photoList[0].result[0].text;

        console.log(icFront, '=', icBack);
        console.log('name:', name);

        if (name && (icFront == icBack)) {
          router.navigate({
            pathname: 'register',
            params: {name}
          });
        } else {
          alert('Identity credentials did not match. Please try again.');
        };
      } else {
        console.error('Error:', responseFront.status, responseBack.status);
      };

      // router.navigate({
      //   pathname: 'register',
      //   params: {name}
      // });
    } catch (error) {
      console.error('Error:', error);
    };
  };

  return (
    <>
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
              <Text style={{color: 'white', fontWeight: '400'}}>Validating...</Text>
            </View>
          </View>
        </Modal>
      )}
      
      {open == 1 ? (
        <CameraView 
          style={styles.camera}
          facing={back}
          autofocus='true'
          ref={ref => setCameraRef(ref)}
        >
          <TouchableOpacity style={{paddingLeft: 10, paddingTop: 50}} onPress={() => setOpen(0)}>
            <Ionicons name="arrow-back-circle" size={40} color='white'/>
          </TouchableOpacity>
          <View style={styles.overlay}>
            <View style={styles.boxOverlay} />
          </View>
          <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
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
            onPress={() => openCamera('front')}
          >
            {frontTicket ? <AntDesign name="checkcircle" size={30} color="black"/> : <Feather name="camera" size={30} color="black"/>}
          </TouchableOpacity>

          <Text style={styles.inputTitle}>BACK NRIC</Text>
          <TouchableOpacity
            style={styles.nricBox}
            onPress={() => openCamera('back')}
          >
            {backTicket ? <AntDesign name="checkcircle" size={30} color="black"/> : <Feather name="camera" size={30} color="black"/>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: (!frontTicket || !backTicket) ? 'gray' : 'black'}]}
            //style={[styles.button, {backgroundColor: 'black'}]}
            onPress={handleValidation}
            disabled={!frontTicket || !backTicket}
          >
            <Text style={styles.buttonText}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>)}
    </>
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
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxOverlay: {
    width: '90%',
    height: '70%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#007bff',
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
    fontSize: 15,
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