import { AppRegistry, NativeModules } from "react-native";

//Import Javascript components
import CallerID from "./CallerID";
import CleanPhoneNumber from "./CleanPhoneNumber";

const { CallNativeModule } = NativeModules;

const handleIncomingCallTask = async (taskData) => {
    const { incomingNumber } = taskData;

    console.log('Headless JS task received incoming number:', incomingNumber);

    //Get wallet connection status and provider
    const { walletProvider } = global.appData;

    if (walletProvider) {
        console.log('User logged in');
        try {
            const cleanedPhoneNumber = await CleanPhoneNumber(incomingNumber);
    
            const profile = await CallerID(cleanedPhoneNumber, walletProvider);
    
            const name = profile[0];
            CallNativeModule.receiveCallerID(name, cleanedPhoneNumber);
            console.log('Caller ID sent to Native Module');
        } catch (error) {
            if (error.message.includes('Invalid phone number length.')) {
                console.log('Invalid phone number length.');
            } else if (error.message.includes('Phone number is not registered')) {
                console.log('Phone number is not registered.');
            } else {
                console.log('Error:', error);
            };
        };
    } else {
        console.log('User not logged in');
    };
};

AppRegistry.registerHeadlessTask('IncomingCallTask', () => handleIncomingCallTask);