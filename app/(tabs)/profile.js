import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../supabase/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

const profile = () => {
  const {session} = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Signed out successfully.");
      router.replace('login');
    } catch (error) {
        console.log("Unable to sign out: ", error);
    };
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