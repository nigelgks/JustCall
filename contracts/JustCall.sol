// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract JustCall {
    address public owner;
    
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
    modifier onlyNewUser(string calldata _phoneNumber) {
        require(profile[msg.sender].addr == address(0), "User already registered.");
        require(bytes(users[_phoneNumber]).length == 0, "Phone number already registered");
        _;
    }

    //Validate phone number format
    modifier validatePhoneNum(string calldata _phoneNumber) {
        require(bytes(_phoneNumber).length == 10, "Invalid phone number length.");
        _;
    }

    //Validate phone number exist
    modifier validateNumberLookup(string calldata _phoneNumber) {
        require(bytes(users[_phoneNumber]).length != 0, "Phone number is not registered.");
        _;
    }

    //Validate address exist
    modifier validateAddressLookup(address _addr) {
        require(profile[_addr].addr != address(0), "User does not exist.");
        _;
    }

    //Registration for new user
    function register(
        string calldata _fullName,
        string calldata _phoneNumber
    ) external onlyNewUser(_phoneNumber) validatePhoneNum(_phoneNumber) {
        profile[msg.sender] = Profile({
            addr: msg.sender,
            fullName: _fullName,
            phoneNumber: _phoneNumber
        });

        users[_phoneNumber] = _fullName;
    }

    //Get full name from phone number lookup
    function getUserByPhoneNumber(
        string calldata _phoneNumber
    ) external validatePhoneNum(_phoneNumber) validateNumberLookup(_phoneNumber) view returns(
        string memory,
        string memory phoneNumber
    ) {
        string memory fullName = users[_phoneNumber];
        return (fullName, _phoneNumber);
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
    function removeUser(address _addr) external onlyOwner validateAddressLookup(_addr) {
        Profile storage user = profile[_addr];
        delete users[user.phoneNumber];
        delete profile[_addr];
    }
}