const hre = require("hardhat");

async function main() {
  // ۱. قرارداد را از کامپایلر می‌گیریم
  const BaseVault = await hre.ethers.getContractFactory("BaseVault");
  
  // ۲. قرارداد را دیپلوی می‌کنیم
  const vault = await BaseVault.deploy();

  // ۳. منتظر می‌مانیم تا دیپلوی کامل شود
  await vault.waitForDeployment();

  // ۴. آدرسِ قراردادِ دیپلوی شده را چاپ می‌کنیم
  console.log("BaseVault deployed to:", await vault.getAddress());
}

// اجرای تابع اصلی و مدیریت خطاها
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});