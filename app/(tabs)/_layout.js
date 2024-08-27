import React from 'react'
import { Tabs } from 'expo-router'
import AuthProvider from '../../providers/AuthProvider';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="browse"/>
      <Tabs.Screen name="keypad"/>
      <Tabs.Screen name="profile"/>
    </Tabs>
  );
};

export default TabLayout;