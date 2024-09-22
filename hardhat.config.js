require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.EXPO_PUBLIC_INFURA_PROJECT_ID}`
    }
  }
};
