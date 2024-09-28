require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.EXPO_PUBLIC_INFURA_PROJECT_ID}`,
      accounts: [process.env.EXPO_PUBLIC_PRIVATE_KEY_ACCOUNT_1],
      gasPrice: 5000000000,
      gas: 6000000
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.EXPO_PUBLIC_ETHERSCAN_API
    }
  }
};
