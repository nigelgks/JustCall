//const {ethers} = require('ethers');
const {ethers} = require('hardhat');
//const contract = require("../artifacts/contracts/JustCall.sol/JustCall.json");
//const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const abi = contract.abi;

//const JustCall = new ethers.Contract(contractAddress, abi, provider);

async function main() {
    //const justCall = await JustCall.deploy();

    const JustCall = await ethers.getContractFactory("JustCall");
    const justCall = JustCall.attach(contractAddress);

    //const signer = provider.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

    //const justCall = JustCall.connect(signer);

    console.log(await justCall.owner());

    //await justCall.register("John Doe", "1234567890");

    await justCall.removeUser(await justCall.owner());

    const user = await justCall.getUserByPhoneNumber("1234567890");
    console.log("user: ", user);

    // const profile = await justCall.getUserByAddress();
    // console.log("profile: ", profile);

    // await justCall.removeUser(justCall.owner());
};

main();