const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoraBTC", function () {
  let MemoraBTC;
  let memoraBTC;
  let owner;
  let judge;
  let heir;
  let minter;
  let other;

  beforeEach(async function () {
    [owner, judge, heir, minter, other] = await ethers.getSigners();

    // Deploy the contract with the judge address
    MemoraBTC = await ethers.getContractFactory("MemoraBTC");
    memoraBTC = await MemoraBTC.deploy(judge.address);
  });

  describe("createEscrow", function () {
    it("should create an escrow and emit the EscrowCreated event", async function () {
      const btcAmount = ethers.parseEther("1"); // 1 ETH as BTC equivalent
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await expect(
        memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri, { value: btcAmount })
      )
        .to.emit(memoraBTC, "EscrowCreated")
        .withArgs(1, minter.address, heir.address, uri);

      const escrow = await memoraBTC.escrowInfo(1);
      expect(escrow.heir).to.equal(heir.address);
      expect(escrow.minter).to.equal(minter.address);
      expect(escrow.btcAmount).to.equal(btcAmount);
      expect(escrow.prompt).to.equal(prompt);
    });

    it("should revert if no BTC amount is sent", async function () {
      const btcAmount = ethers.parseEther("1");
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await expect(
        memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri)
      ).to.be.revertedWith("Please send the BTC amount to the Memora");
    });

    it("should revert if sent BTC amount does not match the specified amount", async function () {
      const btcAmount = ethers.parseEther("1");
      const wrongAmount = ethers.parseEther("0.5"); // Send less than required
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await expect(
        memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri, { value: wrongAmount })
      ).to.be.revertedWith("Amount mismatch in BTC transfer");
    });
  });

  describe("declareTrigger", function () {
    beforeEach(async function () {
      const btcAmount = ethers.parseEther("1");
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri, { value: btcAmount });
    });

    it("should allow the judge to declare a trigger", async function () {
      await expect(memoraBTC.connect(judge).declareTrigger(1))
        .to.emit(memoraBTC, "JudgeDeclaredTriggered")
        .withArgs(1);

      const escrow = await memoraBTC.escrowInfo(1);
      expect(escrow.isTriggerDeclared).to.be.true;
    });

    it("should revert if someone other than the judge tries to declare the trigger", async function () {
      await expect(memoraBTC.connect(other).declareTrigger(1)).to.be.revertedWith("Only the judge can declare trigger");
    });
  });

  describe("heirSign", function () {
    beforeEach(async function () {
      const btcAmount = ethers.parseEther("1");
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri, { value: btcAmount });
      await memoraBTC.connect(judge).declareTrigger(1);
    });

    it("should allow the heir to sign and complete the BTC transfer", async function () {

      await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]); // Simulate passing buffer period

      await expect(memoraBTC.connect(heir).heirSign(1))
        .to.emit(memoraBTC, "HeirSigned")
        .and.to.emit(memoraBTC, "BTCTransferCompleted");

      const escrow = await memoraBTC.escrowInfo(1);
      expect(escrow.isHeirSigned).to.be.true;


    });

    it("should revert if someone other than the heir tries to sign", async function () {
      await expect(memoraBTC.connect(other).heirSign(1)).to.be.revertedWith("Only the heir can sign");
    });

    // it("should revert if the buffer period has not passed", async function () {
    //   await expect(memoraBTC.connect(heir).heirSign(1)).to.be.revertedWith("Buffer period has not passed yet");
    // });
  });

  describe("disableTrigger", function () {
    beforeEach(async function () {
      const btcAmount = ethers.parseEther("1");
      const prompt = "Prompt for the escrow";
      const farcasterID = 123;
      const uri = "https://example.com";

      await memoraBTC.connect(minter).createEscrow(heir.address, btcAmount, prompt, farcasterID, uri, { value: btcAmount });
      await memoraBTC.connect(judge).declareTrigger(1);
    });

    it("should allow the escrow creator to disable the trigger", async function () {
      await expect(memoraBTC.connect(minter).disableTrigger(1))
        .to.emit(memoraBTC, "TriggerDisabled")
        .withArgs(1);

      const escrow = await memoraBTC.escrowInfo(1);
      expect(escrow.isTriggerDeclared).to.be.false;
    });

    it("should revert if someone other than the escrow creator tries to disable the trigger", async function () {
      await expect(memoraBTC.connect(heir).disableTrigger(1)).to.be.revertedWith("Only the escrow creator can disable the trigger");
    });
  });

  describe("changeBuffer", function () {
    it("should allow the owner to change the buffer period", async function () {
      const newBufferPeriod = 60 * 60; // 1 hour in seconds
      await expect(memoraBTC.connect(owner).changeBuffer(newBufferPeriod))
        .to.emit(memoraBTC, "BufferChanged")
        .withArgs(newBufferPeriod);

      // You can check buffer period via storage slot but that's advanced
      // We assume that emitting event confirms the change in this case.
    });

    it("should revert if someone other than the owner tries to change the buffer", async function () {
      const newBufferPeriod = 60 * 60;
      await expect(memoraBTC.connect(other).changeBuffer(newBufferPeriod)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
