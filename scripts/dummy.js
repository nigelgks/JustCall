//const {ethers} = require('ethers');
//const contract = require("../artifacts/contracts/JustCall.sol/JustCall.json");
//const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
//const abi = contract.abi;


const {ethers} = require('hardhat');
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
    //Fetch signers and assign
    const [owner, addr1, addr2] = await ethers.getSigners();
    const user = owner;
    const removeUser = addr1;

    //Establish contract
    const JustCall = await ethers.getContractFactory("JustCall");
    //const JustCall = new ethers.Contract(contractAddress, abi, provider);

    //Attach user to contract
    const justCall = JustCall.attach(contractAddress).connect(user);

    //Fetch wallet balance before any transation or function call
    const oldBalance = await ethers.provider.getBalance(user);



    //Call owner address
    //console.log(await justCall.owner());


    //Register new user
    try {
        await justCall.register("JOHN DOE", "+60198781785");
    } catch(error) {
        //Throw revereted error if user already exist
        if (error.message.includes('User already registered.')) {
            console.log("User already registered.");
        } else if (error.message.includes('Phone number already registered')) {
            console.log("Phone number already registered.");
        } else if (error.message.includes('Invalid phone number length.')) {
            console.log("Invalid phone number length.");
        } else {
            console.log('Error:', error);
        };
    };


    //Remove user (owner only)
    // try {
    //     await justCall.removeUser(removeUser.address);
    // } catch(error) {
    //     if (error.message.includes('Only the contract administrator can call this function.')) {
    //         console.log("Only the contract administrator can call this function.");
    //     } else if (error.message.includes('User does not exist.')) {
    //         console.log("User does not exist.");
    //     } else {
    //         console.log('Error:', error);
    //     };
    // };


    //Get user's name given phone number
    // try {
    //     const profilePhone = await justCall.getUserByPhoneNumber("+60198781785");
    //     console.log("user: ", profilePhone);
    // } catch (error) {
    //     if (error.message.includes('Invalid phone number length.')) {
    //         console.log("Invalid phone number length.");
    //     } else if (error.message.includes('Phone number is not registered')) {
    //         console.log("Phone number is not registered.");
    //     } else {
    //         console.log('Error:', error);
    //     };
    // };


    //Get user's profile given address
    // try {
    //     const profileAddr = await justCall.getUserByAddress();
    //     console.log("profile: ", profileAddr);
    // } catch (error) {
    //     if (error.message.includes('User does not exist.')) {
    //         console.log("User does not exist.");
    //     } else {
    //         console.log('Error:', error);
    //     };
    // };



    //Fetch wallet balance after any transaction or function call
    const newBalance = await ethers.provider.getBalance(user);

    //Display wallet balance and transaction cost (ETH)
    console.log("Balance:", ethers.formatEther(newBalance), "ETH");
    console.log("Cost:", (ethers.formatEther(oldBalance)) - (ethers.formatEther(newBalance)), "ETH");
};

main();