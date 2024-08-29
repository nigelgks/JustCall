// UPDATE THE CODE INPUT TO SOMETHING BETTER
// AND LIMIT TO 6 CHARACTERS ONLY

import { View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
   } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router/build';
import { supabase } from '../../supabase/supabase';
import { useAuth } from '../../providers/AuthProvider';

const verification = () => {
const {session} = useAuth();
const router = useRouter();

useEffect(() => {
   if (session) {
       console.log(session.user.phone_confirmed_at);
   };
}, [session]);

//const BaseURL = 'http://192.168.0.147:3000';

const { signIn, phoneNum, email, password } = useLocalSearchParams();
const [ code, setCode ] = useState(null);

const hiddenNum = (phoneNum) => {
   lastNum = phoneNum.slice(9);
   formattedNum = '+60 01*-*** ' + lastNum;
   return formattedNum;
};

const sendCode = async () => {
   // fetch(`${BaseURL}/verify/${phoneNum}`, {
   //     method: 'GET',
   //     headers: {
   //       'Content-Type': 'application/json',
   //     },
   // })
   // .catch(err => {
   //     alert(err);
   //     console.log(err);
   // });

   if (signIn == 'true') {
       try {
           await supabase.auth.signInWithPassword({
               phone: phoneNum,
               password
           });
       } catch (error) {
           console.log("Unable to send code: ", error);
       };
   } else {
       try {
           await supabase.auth.signUp({
               phone: phoneNum,
               password
           });
       } catch (error) {
           console.log("Unable to send code: ", error);
       };
   };
};

const checkCode = async () => {
   // fetch(`${BaseURL}/check/${phoneNum}/${code}`, {
   //     method: 'GET',
   //     headers: {
   //       'Content-Type': 'application/json',
   //     },
   // })
   // .then(res => res.json())
   // .then(res => {
   //     console.log(res);
   //     if (res.status === 'approved') {
   //         alert('Phone Verified');
           
   //         if (signIn == 'true') {
   //             console.log('Logging in');
   //             logIn();
   //         } else {
   //             console.log('Signing up');
   //             signingUp();
   //         }
   //     } else {
   //         alert('Verification failed try again!');
   //         return false;
   //     }
   // });

   try {
       await supabase.auth.verifyOtp({
           phone: phoneNum,
           token: code,
           type: 'sms'
       });

       // if (signIn == 'true') {
       //     console.log('Logging in');
       //     logIn();
       // } else {
       //     console.log('Signing up');
       //     signingUp();
       // };
   } catch (error) {
       console.log("Unable to verify code: ", error);
   } finally {
       //const {session} = await supabase.auth.getSession();
       console.log(session);
   };
};

const logIn = async () => {
   try {
       await supabase.auth.signInWithPassword({
           phone: phoneNum,
           password
       });
       console.log("Logged in successfully.");
   } catch (error) {
       console.log("Unable to login: ", error);
   };
};

const signingUp = async () => {
   try {
       await supabase.auth.signUp({
           phone: phoneNum,
           password
       });

       await supabase.auth.verifyOtp({
           phone: phoneNum,
           type: 'sms'
       })

       // await supabase.auth.updateUser({
       //     email
       // });

       // await supabase.auth.verifyOtp({
       //     email,
       //     type: 'email'
       // });

       console.log("Sign up successfully. Please verify your email address.");
   } catch (error) {
       console.log("Unable to register: ", error);
   } finally {
       console.log(session);
   };
};

sendCode();

return (
   <KeyboardAvoidingView
       keyboardVerticalOffset={-500}
       behavior={Platform.OS == "ios" ? "padding" : "height"}
       style={{flex: 1, paddingTop: 35}}
   >
       <ScrollView>
           <View style={styles.container}>
               <Text style={styles.title}>Phone Number Verification</Text>
               <Text style={styles.desc}>Verification code has been sent to you.</Text>
               <Text style={styles.desc}>Please check your SMS inbox.</Text>

               <Text style={styles.pNum}>{hiddenNum(phoneNum)}</Text>

               <Text style={styles.inputTitle}>ONE-TIME PASSWORD (OTP)</Text>
               <TextInput
                   style={styles.input}
                   value={code}
                   placeholder='XXX-XXX'
                   onChangeText={(text) => setCode(text)}
                   keyboardType='numeric'
               />
               <TouchableOpacity
                   style={styles.pressable}
                   onPress={sendCode}
               >
                   <Text style={{textAlign: 'center'}}>
                   Resend code
                   </Text>
               </TouchableOpacity>
               <TouchableOpacity
                   style={styles.button}
                   onPress={checkCode}
                   disabled={!code}
               >
                   <Text style={styles.buttonText}>
                   Next
                   </Text>
               </TouchableOpacity>
           </View>
       </ScrollView>
   </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
container: {
   justifyContent: 'center',
   padding: 60
},
title: {
   fontSize: 40,
   fontWeight: 'bold',
   color: 'black',
   marginBottom: 15,
   alignSelf: 'center',
   textAlign: 'center'
},
desc: {
   fontSize: 14,
   fontWeight: '400',
   color: 'black',
   alignSelf: 'center',
   textAlign: 'center'
},
pNum: {
   fontSize: 20,
   fontWeight: '500',
   alignSelf: 'center',
   marginTop: 25
},
inputTitle: {
   fontSize: 14,
   fontWeight: '400',
   color: 'black',
   marginTop: 30,
   marginBottom: 3,
   textAlign: 'left',
   paddingBottom: 3
},
input: {
   width: '100%',
   height: 50,
   borderColor: 'gray',
   borderWidth: 1,
   borderRadius: 8,
   paddingLeft: 10,
   marginBottom: 15
},
pressable: {
   width: '50%',
   marginBottom: 10,
   backgroundColor: 'transparent',
   borderColor: 'transparent',
   alignSelf: 'center'
},
button: {
   width: '100%',
   height: 50,
   backgroundColor: 'black',
   justifyContent: 'center',
   alignItems: 'center',
   borderRadius: 8,
   marginTop: 15
},
buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold'
}
});

export default verification