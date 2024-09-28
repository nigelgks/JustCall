import React, { useEffect, useState } from 'react';
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

//Import APIs and router
import { useLocalSearchParams, useRouter } from 'expo-router/build';
import { supabase } from '../../supabase/supabase';
import '@walletconnect/react-native-compat';
import { useAppKitAccount } from '@reown/appkit-ethers-react-native';

const Verification = () => {
    //Retrieve connected wallet address
    const { address } = useAppKitAccount();
    
    //Expo router navigation
    const router = useRouter();

    //Passed variables from previous page
    const { signIn, name, phoneNum, email, password } = useLocalSearchParams();

    //useState hooks
    const [code, setCode] = useState(new Array(6).fill(''));
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timerButton, setTimerButton] = useState(true);
    const [timer, setTimer] = useState(0);

    //OTP code input
    const inputs = [];

    //Manage user session
    useEffect(() => {
        //Check whether user session already exist
        if (session) {
            //Check whether phone is confirmed
            if (session.user.phone_confirmed_at) {
                const signInDate = new Date(session.user.last_sign_in_at);
                const confirmedDate = new Date(session.user.phone_confirmed_at);

                //Verify whether user confirmed before login
                if (signInDate > confirmedDate) {
                    console.log(confirmedDate);
                    console.log('Logged in succesfully.');

                    //Navigate to main page
                    router.replace('keypad');
                } else {
                    console.log("Not verified yet.");
                };
            } else {
                console.log("Not verified yet.");
            };
        } else {
            //Resend OTP to user if session is null
            console.log("No session.");
            sendCode();
        };
    }, [session]);

    //Function to format OTP
    const handleOTP = (text, index) => {
        if (text.length > 1) return;  // Ensures single digit entry
        const newOtp = [...code];
        newOtp[index] = text;
        setCode(newOtp);

        // Automatically focus the next input if available
        if (text && index < 5) {
            inputs[index + 1].focus();
        };
    };

    //Set button disable if code is incomplete
    const isButtonDisabled = code.some(value => value === '');

    //Function to re-format phone number for display
    const hiddenNum = (phoneNum) => {
        if (phoneNum.length == 12) {
            lastNum = phoneNum.slice(8);
            formattedNum = '+60 1* - *** ' + lastNum;
        } else {
            lastNum = phoneNum.slice(9);
            formattedNum = '+60 1* - **** ' + lastNum;
        };
        return formattedNum;
    };

    //Function to send user OTP
    const sendCode = async () => {
        setTimerButton(true);
        setTimer(60);

        if (signIn == 'true') {
            //Sign in user with OTP
            const {error} = await supabase.auth.signInWithOtp({
                phone: phoneNum
            });

            if (error) {
                console.log("Unable to send code: ", error);
                alert('Invalid phone number.');
                router.back();
            } else {
                console.log('Code sent successfully.');
            };
        } else {
            //Sign up user with OTP
            const {error} = await supabase.auth.signUp({
                phone: phoneNum,
                password
            });

            if (error) {
                console.log("Unable to send code: ", error);
            } else {
                console.log('Code sent successfully.');
            };
        };

        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer < 1) {
                    clearInterval(countdown);
                    setTimerButton(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000)
    };

    //Function to verify OTP
    const checkCode = async () => {
        setLoading(true);

        const strCode = code.join('');

        const {error} = await supabase.auth.verifyOtp({
            phone: phoneNum,
            token: strCode,
            type: 'sms'
        });

        if (error) {
            console.log("Unable to send code: ", error);
            alert('Code entered is invalid or has expired.');
        } else {
            const {data} = await supabase.auth.getSession();

            if (signIn != 'true') {
                await addEmail();
                await addAccount(data.session.user.id, address);
            };
            
            setSession(data.session);
        };

        setLoading(false);
    };

    //Function to update email in database
    const addEmail = async () => {
        const {error} = await supabase.auth.updateUser({
            email
        });

        if (error) {
            console.log('Unable to add email: ', error);
        } else {
            console.log('Email added successfully. Please check inbox to confirm.');
        };
    };

    //Function to add user information in database
    const addAccount = async (userID, addr) => {
        const addData = {
            id: userID,
            name,
            address: addr,
            phone: phoneNum
        };
        
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.container}>
                    <Text style={styles.title}>Phone Number Verification</Text>
                    <Text style={styles.desc}>Verification code has been sent to you.</Text>
                    <Text style={styles.desc}>Please check your SMS inbox.</Text>

                    <Text style={styles.pNum}>{hiddenNum(phoneNum)}</Text>

                    <Text style={styles.inputTitle}>ONE-TIME PASSWORD (OTP)</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={input => inputs[index] = input}
                                style={styles.input}
                                keyboardType="numeric"
                                maxLength={1}
                                onChangeText={text => handleOTP(text, index)}
                                value={digit}
                            />
                        ))}
                    </View>
                    
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: isButtonDisabled ? 'gray' : 'black'}]}
                        onPress={checkCode}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.buttonText}>
                            Next
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pressable}
                        onPress={sendCode}
                        disabled={timerButton}
                    >
                        <Text style={{textAlign: 'center', color: timerButton ? 'gray' : 'black'}}>
                            Resend code ({timer})
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 60
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
        textAlign: 'left',
        paddingBottom: 10
    },
    input: {
        width: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        padding: 5,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '400'
    },
    pressable: {
        width: '50%',
        marginTop: 30,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        alignSelf: 'center'
    },
    button: {
        width: '100%',
        height: 50,
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

export default Verification;