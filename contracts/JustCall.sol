// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract JustCall {
    struct Profile {
        address addr;
        string fullName;
        string phoneNumber;
    }

    mapping(string => string fullName) public users;
    mapping(address => Profile) private profile;

    function register(string calldata _fullName, string calldata _phoneNumber) external {
        profile[msg.sender] = Profile({
            addr: msg.sender,
            fullName: _fullName,
            phoneNumber: _phoneNumber
        });

        users[_phoneNumber] = _fullName;
    }

    function getUserByPhoneNumber(string calldata _phoneNumber) external view returns(string memory, string memory phoneNumber) {
        string memory fullName = users[_phoneNumber];
        return (fullName, _phoneNumber);
    }

    function getUserByAddress() external view returns(string memory fullName, string memory phoneNumber, address addr) {
        Profile storage user = profile[msg.sender];
        return (user.fullName, user.phoneNumber, user.addr);
    }
}
