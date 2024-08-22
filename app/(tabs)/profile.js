import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('login');
  };

  return (
    <View>
      <Text style={{paddingBottom: 20}}>profile</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default profile