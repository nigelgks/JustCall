import React from 'react'
import { Tabs } from 'expo-router'

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