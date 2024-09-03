import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator } from "react-native";

const StartPage = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <ActivityIndicator/>
        );
    };

    if (!session) {
        return <Redirect href="wallet" />;
    };

    return <Redirect href="keypad" />;
};

export default StartPage;