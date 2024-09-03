import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Config from "react-native-config";
import '@walletconnect/react-native-compat';
import { createWeb3Modal, defaultConfig, useWalletInfo, useWeb3ModalAccount, Web3Modal } from '@web3modal/ethers-react-native';
import { W3mButton } from '@web3modal/ethers-react-native';
import { useRouter } from 'expo-router';

const projectId = Config.WALLETCONNECT_PROJECT_ID;
const metadata = {
    name: 'JustCall',
    description: 'JustCall Dapp',
    url: 'https://walletconnect.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
      native: 'YOUR_APP_SCHEME://'
    }
};
const config = defaultConfig({metadata});

const mainnet = {
    chainId: 1,
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/6ec31da19e8b4d44a456b8ed4b8a6846'
}

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://sepolia.infura.io/v3/6ec31da19e8b4d44a456b8ed4b8a6846'
}
  
const chains = [mainnet, sepolia]

createWeb3Modal({
    projectId,
    chains,
    config
});

const wallet = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.navigate('login');
  };

  const { isConnected } = useWeb3ModalAccount();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to your wallet!</Text>
      <Text style={styles.desc}>Or create a new wallet if you haven't done so!</Text>
      <Web3Modal/>
      <W3mButton balance='show'/>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}
        disabled={!isConnected}
      >
        <Text style={styles.textButton}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

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
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 35
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default wallet