const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("JustCallModule", (m) => {

  const JustCall = m.contract("JustCall", []);

  return { JustCall };
});
