import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login"/>
      <Stack.Screen name="register"/>
      <Stack.Screen name="verification"/>
    </Stack>
  );
};

export default AuthLayout;