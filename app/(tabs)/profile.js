import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../supabase/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

const profile = () => {
  const {session} = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setLoading(false);
      console.log("Signed out successfully.");
      alert("Signed out successfully.")
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
      {loading ? <ActivityIndicator/> : null}
    </View>
  )
}

export default profile