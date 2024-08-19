const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("JustCallModule", (m) => {

  const justCallContract = m.contract("JustCall", []);

  return { justCallContract };
});
