import React from 'react';
import { Stack } from 'expo-router';
import { Auth0Provider } from 'react-native-auth0';

const RootLayout = () => {
  return (
    <Auth0Provider domain={"dev-fk04tshzl1blxaeq.us.auth0.com"} clientId={"2758sgCmni9wQzLw3qkeTZFBVSARxGuL"}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"/>
      </Stack>
    </Auth0Provider>
    
  );
};

export default RootLayout;