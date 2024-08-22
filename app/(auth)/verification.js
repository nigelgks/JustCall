import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build';

const verification = () => {
    const router = useRouter();
    const { phoneNum, password } = useLocalSearchParams();
    const [ otpPass, setOtpPass ] = useState(null);

    const hiddenNum = (phoneNum) => {
        lastNum = phoneNum.slice(8);
        formattedNum = '+601*-*** ' + lastNum;
        return formattedNum;
    };
    
    const handleOTP = () => {

    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1, paddingTop: 35}}
        >
            <ScrollView>
                <TouchableOpacity style={{paddingLeft: 10}} onPress={() => router.navigate('register')}>
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
                        value={otpPass}
                        placeholder='XXX-XXX'
                        onChangeText={(text) => setOtpPass(text)}
                        keyboardType='numeric'
                    />
                    <TouchableOpacity
                        style={styles.pressable}
                        onPress={handleOTP}
                    >
                        <Text style={{textAlign: 'center'}}>
                        Resend code
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        disabled={!otpPass}
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