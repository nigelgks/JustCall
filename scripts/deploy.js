const { ethers } = require("hardhat");

async function main() {
    const JustCall = await ethers.getContractFactory("JustCall");
    const justCall = await JustCall.deploy();

    await justCall.deployed();

    console.log(`JustCall deployed to: ${justCall.address}`);
};

main().catch(console.error);