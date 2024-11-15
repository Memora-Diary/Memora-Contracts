const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MemoraBTC = buildModule("MemoraBTC", (m) => {

  const judgeAddress = m.getParameter("judgeAddress", "0x843E73b0143F4A7DeBF05a9646917787B06f3A46");

  const memoraNFT = m.contract("MemoraBTC", [judgeAddress]);

  return { MemoraBTC };
});

module.exports = MemoraBTC;