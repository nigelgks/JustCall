import { AppRegistry, NativeModules } from "react-native";

//Import Javascript components
import CallerID from "./CallerID";
import CleanPhoneNumber from "./CleanPhoneNumber";
import StartPage from "../../app";
import { name as appName } from '../../app.json';

const { CallNativeModule } = NativeModules;

const handleIncomingCallTask = async (taskData) => {
    const { incomingNumber } = taskData;

    console.log('[HEADLESS] Task received incoming number:', incomingNumber);

    //Get wallet connection status and provider
    const { walletSigner } = global.appData;

    if (walletSigner) {
        console.log('[HEADLESS] User logged in');
        try {
            const cleanedPhoneNumber = await CleanPhoneNumber(incomingNumber);
    
            const profile = await CallerID(cleanedPhoneNumber, walletSigner);
    
            const name = profile[0];
            CallNativeModule.receiveCallerID(name, cleanedPhoneNumber);
            console.log('[HEADLESS] Caller ID sent to Native Module');
        } catch (error) {
            if (error.message.includes('[HEADLESS] Invalid phone number length.')) {
                console.log('[HEADLESS] Invalid phone number length.');
            } else if (error.message.includes('[HEADLESS] Phone number is not registered')) {
                console.log('[HEADLESS] Phone number is not registered.');
            } else {
                console.log('[HEADLESS] Error:', error);
            };
        };
    } else {
        console.log('[HEADLESS] User not logged in');
    };
};

console.log('[HEADLESS] App starting...');
AppRegistry.registerComponent(appName, () => StartPage);
AppRegistry.registerHeadlessTask('IncomingCallTask', () => handleIncomingCallTask);