import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const profile = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // const { clearSession } = useAuth0();

    // try {
    //   await clearSession();
    // } catch (error) {
    //   console.log("Unable to logout:", error);
    // } finally {
    //   router.replace('login');
    // };

    router.replace('login');
  };

  return (
    <View>
      <Text style={{paddingBottom: 20}}>profile</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      {/* <>
        {user && <Text>Logged in as {user.name}</Text>}
        {!user && <Text>Not logged in</Text>}
      </> */}
    </View>
  )
}

export default profile