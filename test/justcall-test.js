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
        await justCall.connect(addr1).register("John Doe", "+60198781785");
        const profile = await justCall.connect(addr1).getUserByAddress();
        expect(profile.fullName).to.equal("John Doe");
        expect(profile.phoneNumber).to.equal("+60198781785");
    });

    it("Should only register once", async function () {
        await justCall.connect(addr1).register("John Doe", "+60198781785");
        await expect(justCall.connect(addr1).register("Jane Doe", "+601987817855"))
            .to.be.revertedWith("User already registered.");
    });

    it("Should register correct phone number format", async function () {
        await expect(justCall.connect(addr1).register("John Doe", "+6019878178"))
            .to.be.revertedWith("Invalid phone number length.");
    });

    it("Should lookup correct phone number format", async function () {
        await justCall.connect(addr1).register("John Doe", "+60198781785");
        await justCall.connect(addr2).register("Jane Doe", "+601987817855");
        await expect(justCall.connect(addr1).getUserByPhoneNumber("+6019878178"))
            .to.be.rejectedWith("Invalid phone number length.");
    });

    it("Should not allow duplicate phone numbers", async function () {
        await justCall.connect(addr1).register("John Doe", "+60198781785");
        await expect(justCall.connect(addr2).register("Jane Doe", "+60198781785"))
            .to.be.revertedWith("Phone number already registered");
    });

    it("Should only lookup existing phone numbers", async function () {
        await expect(justCall.getUserByPhoneNumber("+60198781785"))
            .to.be.revertedWith("Phone number is not registered.");
    });

    it("Should only allow owner to remove users", async function () {
        await justCall.connect(addr1).register("John Doe", "+60198781785");
        await expect(justCall.connect(addr2).removeUser(addr1.address))
            .to.be.revertedWith("Only the contract administrator can call this function.");

        await justCall.removeUser(addr1.address);
        await expect(justCall.getUserByPhoneNumber("+60198781785")).to.be.revertedWith("Phone number is not registered.");
        await expect(justCall.getUserByAddress()).to.be.revertedWith("User does not exist.");
    });
});