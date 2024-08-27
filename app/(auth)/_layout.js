import React from 'react';
import { Stack } from 'expo-router';
import AuthProvider from '../../providers/AuthProvider';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login"/>
      <Stack.Screen name="register"/>
      <Stack.Screen name="verification"/>
      <Stack.Screen name="identification"/>
    </Stack>
  );
};

export default AuthLayout;