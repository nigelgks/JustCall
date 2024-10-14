//Import APIs and router
import { ethers, BrowserProvider } from 'ethers';
import '@walletconnect/react-native-compat';

//Setup contract ABI and address
const contract = require("../../artifacts/contracts/JustCall.sol/JustCall.json");
const abi = contract.abi;
const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDR;

const CallerID = async (phoneNumber, walletSigner) => {
    const provider = new BrowserProvider(walletSigner);
    const signer = await provider.getSigner();
    const justCall = new ethers.Contract(contractAddress, abi, signer);

    const profile = await justCall.getUserByPhoneNumber(phoneNumber);
    console.log("User: ", profile);

    return profile;
}

export default CallerID;