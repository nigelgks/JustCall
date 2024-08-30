// UPDATE THE CODE INPUT TO SOMETHING BETTER
// AND LIMIT TO 6 CHARACTERS ONLY

import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         TextInput,
         ScrollView,
         KeyboardAvoidingView,
         Platform,
         Modal,
         ActivityIndicator
        } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router/build';
import { supabase } from '../../supabase/supabase';

const verification = () => {
    const router = useRouter();
    const { signIn, phoneNum, email, password } = useLocalSearchParams();
    const [session, setSession] = useState(null);
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            if (session.user.phone_confirmed_at) {
                const signInDate = new Date(session.user.last_sign_in_at);
                const confirmedDate = new Date(session.user.phone_confirmed_at);

                if (signInDate > confirmedDate) {
                    console.log(session.user.phone_confirmed_at);
                    console.log('Logged in succesfully.')
                    router.replace('keypad');
                } else {
                    console.log("Not verified yet.");
                };
            } else {
                console.log("Not verified yet.");
            }
        } else {
            console.log("No session.");
            sendCode();
        };
    }, [session]);

    const hiddenNum = (phoneNum) => {
        lastNum = phoneNum.slice(9);
        formattedNum = '+60 01*-*** ' + lastNum;
        return formattedNum;
    };

    const sendCode = async () => {
        if (signIn == 'true') {
            const {error} = await supabase.auth.signInWithOtp({
                phone: phoneNum
            });

            if (error) {
                console.log("Unable to send code: ", error);
                alert('Invalid phone number.');
                router.back();
            } else {
                console.log('Code sent successfully.')
            };
        } else {
            const {error} = await supabase.auth.signUp({
                phone: phoneNum,
                password
            });

            if (error) {
                console.log("Unable to send code: ", error);
            } else {
                console.log('Code sent successfully.')
            };
        };
    };

    const checkCode = async () => {
        setLoading(true);

        const {error} = await supabase.auth.verifyOtp({
            phone: phoneNum,
            token: code,
            type: 'sms'
        });

        if (error) {
            console.log("Unable to send code: ", error);
        } else {
            const {data} = await supabase.auth.getSession();

            if (signIn != 'true') {
                await addEmail();
                await addAccount(data.session.user.id);
            };
            
            setSession(data.session);
        };

        setLoading(false);
    };

    const addEmail = async () => {
        const {error} = await supabase.auth.updateUser({
            email
        });

        if (error) {
            console.log('Unable to add email: ', error);
        } else {
            console.log('Email added successfully. Please check inbox to confirm.')
        };
    };

    const addAccount = async (userID) => {
        const addData = {
            id: userID,
            name: 'Nigel Gan',
            address: '0x-abc123'
        }
        
        const {error} = await supabase
            .from('accounts')
            .insert([addData])
            .select();
        
        if (error) {
            console.log('Unable to update user table:', error);
        } else {
            console.log('User table updated.');
        };
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1, paddingTop: 50}}
        >
            {loading && (
                <Modal
                    transparent={true}
                    animationType='fade'
                    visible={loading}
                    onRequestClose={() => setLoading(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.loadingWrapper}>
                            <ActivityIndicator size='large' color='white'/>
                            <Text style={{color: 'white', fontWeight: '400'}}>Loading...</Text>
                        </View>
                    </View>
                </Modal>
            )}

            <ScrollView>
                <TouchableOpacity style={{paddingLeft: 10}} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-circle" size={40} color='black'/>
                </TouchableOpacity>

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
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 60
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    loadingWrapper: {
        backgroundColor: 'black',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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