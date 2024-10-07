import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import AuthProvider from '../providers/AuthProvider';
import ConnectionModal from '../components/modal/ConnectionModal';

const RootLayout = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe(); // Clean up the event listener on unmount
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(auth)"/>
        <Stack.Screen name="(tabs)"/>
      </Stack>
      {isOffline && <ConnectionModal/>}
    </AuthProvider>
  );
};

export default RootLayout;