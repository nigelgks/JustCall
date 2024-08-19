const { ethers } = require("hardhat");

const contract = require("../artifacts/contracts/JustCall.sol/JustCall.json");

async function main() {
    // The deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // ABI of the deployed contract
    const abi = JSON.stringify(contract.abi);

    // Get the list of signers (accounts)
    const signers = await ethers.getSigners();

    // Select the second account (index 0) as the signer
    const signer = signers[0];

    // Create a contract instance connected to the selected signer
    const justCall = new ethers.Contract(contractAddress, abi, signer);

    // Register a new user
    try {
        const tx = await justCall.register("John Doe", "1234567890");
        await tx.wait(); // Wait for the transaction to be mined
        console.log("User registered successfully with address:", signer.address);
    } catch (error) {
        console.error("Error:", error.message);
    }

    // Get user by address
    try {
        const profile = await justCall.getUserByAddress();
        console.log("User profile:", profile);
    } catch (error) {
        console.error("Error:", error.message);
    }

    // Get user by phone number
    try {
      const user = await justCall.getUserByPhoneNumber("1234567890");
      console.log("User profile:", user);
    } catch (error) {
        console.error("Error:", error.message);
    }

    // Remove user by address
    try {
      await justCall.removeUser(signer.address);
      console.log("User removed successfully.")

      try {
        await justCall.getUserByPhoneNumber("1234567890");
        // If this line is reached, it means the user is still registered, so set removed to false
        console.log("User still exists after removal.");
      } catch (error) {
          // If an error is thrown, check if it is the expected error
          if (error.message.includes("Phone number is not registered.")) {
              console.log("User successfully removed.");
          } else {
              console.error("Unexpected error:", error.message);
          }
      }

    } catch (error) {
        console.error("Error removing user:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});