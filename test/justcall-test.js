const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JustCall", function () {
    let JustCall;
    let justCall;
    let owner, addr1, addr2;

    beforeEach(async function () {
        JustCall = await ethers.getContractFactory("JustCall");
        [owner, addr1, addr2] = await ethers.getSigners();
        justCall = await JustCall.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await justCall.owner()).to.equal(owner.address);
    });

    it("Should register a new user", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        const profile = await justCall.connect(addr1).getUserByAddress();
        expect(profile.fullName).to.equal("John Doe");
        expect(profile.phoneNumber).to.equal("1234567890");
    });

    it("Should only register once", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        await expect(justCall.connect(addr1).register("Jane Doe", "0987654321"))
            .to.be.revertedWith("User already registered.");
    });

    it("Should register correct phone number format", async function () {
        await expect(justCall.connect(addr1).register("John Doe", "123456789"))
            .to.be.revertedWith("Invalid phone number length.");
    });

    it("Should lookup correct phone number format", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        await justCall.connect(addr2).register("Jane Doe", "0987654321");
        await expect(justCall.connect(addr1).getUserByPhoneNumber("987654321"))
            .to.be.rejectedWith("Invalid phone number length.");
    });

    it("Should not allow duplicate phone numbers", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        await expect(justCall.connect(addr2).register("Jane Doe", "1234567890"))
            .to.be.revertedWith("Phone number already registered");
    });

    it("Should not allow duplicate phone numbers", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        await expect(justCall.connect(addr2).register("Jane Doe", "1234567890"))
            .to.be.revertedWith("Phone number already registered");
    });

    it("Should only lookup existing phone numbers", async function () {
        await expect(justCall.getUserByPhoneNumber("1234567890"))
            .to.be.revertedWith("Phone number is not registered.");
    });

    it("Should only allow owner to remove users", async function () {
        await justCall.connect(addr1).register("John Doe", "1234567890");
        await expect(justCall.connect(addr2).removeUser(addr1.address))
            .to.be.revertedWith("Only the contract administrator can call this function.");

        await justCall.removeUser(addr1.address);
        await expect(justCall.getUserByPhoneNumber("1234567890")).to.be.revertedWith("Phone number is not registered.");
        await expect(justCall.getUserByAddress()).to.be.revertedWith("User does not exist.");
    });
});