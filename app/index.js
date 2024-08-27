import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator, StyleSheet, Text } from "react-native";

const StartPage = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <ActivityIndicator/>
        );
    };

    if (!session) {
        return <Redirect href="login" />;
    };

    return <Redirect href="keypad" />;
};

export default StartPage;