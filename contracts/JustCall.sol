// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Author: @nigelgks
contract JustCall {
    address public immutable owner;
    
    struct Profile {
        address addr;
        string fullName;
        string phoneNumber;
    }

    mapping(string => string) private users;
    mapping(address => Profile) private profile;

    //Initialize contract owner
    constructor() {
        owner = msg.sender;
    }

    //Validate owner address
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract administrator can call this function.");
        _;
    }

    //Validate new user
    modifier onlyNewUser(string calldata phoneNumber) {
        require(profile[msg.sender].addr == address(0), "User already registered.");
        require(bytes(users[phoneNumber]).length == 0, "Phone number already registered");
        _;
    }

    //Validate phone number format
    modifier validatePhoneNum(string calldata phoneNumber) {
        require(bytes(phoneNumber).length >= 12 && bytes(phoneNumber).length <= 13, "Invalid phone number length.");
        _;
    }

    //Validate phone number exist
    modifier validateNumberLookup(string calldata phoneNumber) {
        require(bytes(users[phoneNumber]).length != 0, "Phone number is not registered.");
        _;
    }

    //Validate address exist
    modifier validateAddressLookup(address addr) {
        require(profile[addr].addr != address(0), "User does not exist.");
        _;
    }

    //Registration for new user
    function register(
        string calldata fullName,
        string calldata phoneNumber
    ) external onlyNewUser(phoneNumber) validatePhoneNum(phoneNumber) {
        profile[msg.sender] = Profile({
            addr: msg.sender,
            fullName: fullName,
            phoneNumber: phoneNumber
        });

        users[phoneNumber] = fullName;
    }

    //Get full name from phone number lookup
    function getUserByPhoneNumber(
        string calldata phoneNumber
    ) external validatePhoneNum(phoneNumber) validateNumberLookup(phoneNumber) view returns(
        string memory,
        string memory
    ) {
        string memory fullName = users[phoneNumber];
        return (fullName, phoneNumber);
    }

    //Get profile details from user address
    function getUserByAddress() external validateAddressLookup(msg.sender) view returns(
        string memory fullName,
        string memory phoneNumber,
        address addr
    ) {
        Profile storage user = profile[msg.sender];
        return (user.fullName, user.phoneNumber, user.addr);
    }

    //Remove profile when requested (owner only)
    function removeUser(address addr) external onlyOwner validateAddressLookup(addr) {
        Profile storage user = profile[addr];
        delete users[user.phoneNumber];
        delete profile[addr];
    }
}