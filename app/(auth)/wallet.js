import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//Import APIs and router
import { useRouter } from 'expo-router';
import '@walletconnect/react-native-compat';
import { createAppKit,
         defaultConfig,
         AppKit,
         AppKitButton,
         useAppKitAccount
        } from '@reown/appkit-ethers-react-native';

//Assign WalletConnect project ID from .env
const projectId = process.env.EXPO_PUBLIC_REOWN_PROJECT_ID;

//WalletConnect metadata
const metadata = {
    name: 'JustCall',
    description: 'JustCall Dapp',
    url: 'https://reown.com/appkit',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
    redirect: {
      native: 'YOUR_APP_SCHEME://'
    }
};

//Assign metadata to WalletConnect config
const config = defaultConfig({metadata});

//Ethereum currency
const mainnet = {
    chainId: 1,
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.EXPO_PUBLIC_INFURA_PROJECT_ID}`
};

//Sepolia currency
const sepolia = {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: `https://sepolia.infura.io/v3/${process.env.EXPO_PUBLIC_INFURA_PROJECT_ID}`
};

//All chains or currencies
const chains = [mainnet, sepolia];

//Establish WalletConnect modal
createAppKit({
    projectId,
    chains,
    config
});

const wallet = () => {
  //Get wallet connection status and provider
  const { isConnected } = useAppKitAccount();

  //Expo router navigation
  const router = useRouter();

  //Function to proceed with login if wallet connected
  const handleContinue = () => {
    router.navigate('login');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to your wallet!</Text>
      <Text style={styles.desc}>Or create a new wallet if you haven't done so!</Text>
      <AppKit/>
      <AppKitButton balance='show'/>
      <TouchableOpacity 
        style={[styles.button, {backgroundColor: isConnected ? 'black' : 'grey'}]}
        onPress={handleContinue}
        disabled={!isConnected}
      >
        <Text style={styles.textButton}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 70
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },
  desc: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    marginBottom: 30,
    alignSelf: 'center',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 25
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400'
  }
});

export default wallet;