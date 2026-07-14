import { expect } from "chai";
import { ethers } from "hardhat";

describe("BaseVault Security & Deposit Tests", function () {
  let vault: any;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    // فرض بر این است که نام قرارداد شما در پوشه contracts برابر با BaseVault است
    const BaseVault = await ethers.getContractFactory("BaseVault");
    vault = await BaseVault.deploy();
    await vault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });
  });

  describe("Deposits", function () {
    it("Should accept ETH deposits and update balances", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      // تست واریز وجه به قرارداد هوشمند
      await expect(
        vault.connect(addr1).deposit({ value: depositAmount })
      ).to.changeEtherBalances([addr1, vault], [-depositAmount, depositAmount]);
    });

    it("Should fail if deposit amount is zero", async function () {
      await expect(
        vault.connect(addr1).deposit({ value: 0 })
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });
});