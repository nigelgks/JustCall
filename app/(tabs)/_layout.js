import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          paddingBottom: 3
        }
      }}
    >
      <Tabs.Screen name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Ionicons name="search-circle-sharp" size={30} color="black" />
            ) : (
              <Ionicons name="search-circle-outline" size={30} color="black" />
            )
          )
        }}
      />
      <Tabs.Screen name="keypad"
        options={{
          title: "Keypad",
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Ionicons name="keypad" size={25} color="black" />
            ) : (
              <Ionicons name="keypad-outline" size={25} color="black" />
            )
          )
        }}
      />
      <Tabs.Screen name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Ionicons name="person-circle-sharp" size={30} color="black" />
            ) : (
              <Ionicons name="person-circle-outline" size={30} color="black" />
            )
          )
        }}
      />
    </Tabs>
  );
};

export default TabLayout;