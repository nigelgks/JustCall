import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator, NativeModules } from "react-native";
import '../components/comp/Headless';

const { CallNativeModule } = NativeModules;

const StartPage = () => {
    //Get hook from useAuth
    const { session, loading } = useAuth();

    //Show loading circle if loading is true
    if (loading) {
        return (
            <ActivityIndicator/>
        );
    };

    //Navigate to wallet page if session does not exist
    if (!session) {
        return <Redirect href="wallet" />;
    };

    //Navigate to wallet page if session exist
    return <Redirect href="keypad" />;
};

export default StartPage;