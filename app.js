let account;
const contractAddress = "0x206622d5257243E92DA410F5FBfAd62A86a295A5"; 

const connectBtn = document.getElementById("connectBtn");
const walletAddressP = document.getElementById("walletAddress");
const vaultBalanceH3 = document.getElementById("vaultBalance");
const txStatusP = document.getElementById("txStatus");

const getProvider = () => window.ethereum || (window.rabby ? window.rabby : null);

async function connectWallet() {
    const provider = getProvider();
    if (provider) {
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            walletAddressP.innerText = `Connected: ${account.substring(0,6)}...${account.substring(38)}`;
            connectBtn.innerText = "Wallet Connected";
            txStatusP.innerText = "";
            await updateBalance();
        } catch (error) {
            txStatusP.innerText = "Connection rejected.";
        }
    } else {
        alert("Please unlock Rabby and refresh!");
    }
}

async function updateBalance() {
    const provider = getProvider();
    if (!account || !provider) return;
    try {
        const cleanAddress = account.toLowerCase().replace("0x", "").padStart(64, '0');
        const data = "0x77e0b5d8" + cleanAddress; 
        
        const response = await provider.request({
            method: 'eth_call',
            params: [{ to: contractAddress, data: data }, 'latest']
        });
        
        const weiBalance = BigInt(response);
        const ethBalance = Number(weiBalance) / 1e18;
        vaultBalanceH3.innerText = `${ethBalance.toFixed(5)} ETH`;
    } catch (error) {
        console.error("Failed to fetch balance:", error);
    }
}

// 1. عملیات واریز (Deposit)
document.getElementById("depositBtn").addEventListener("click", async () => {
    const provider = getProvider();
    const amount = document.getElementById("depositAmount").value;
    if (!amount || !account || !provider) { alert("Connect wallet and enter amount"); return; }
    
    const hexValue = "0x" + (parseFloat(amount) * 1e18).toString(16);
    const data = "0xd0e30db0"; 

    try {
        txStatusP.innerText = "Sending deposit transaction...";
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: account, to: contractAddress, data: data, value: hexValue }],
        });
        txStatusP.innerText = `Deposit Sent! Hash: ${txHash.substring(0,15)}...`;
        setTimeout(updateBalance, 5000);
    } catch (error) {
        txStatusP.innerText = "Deposit failed.";
    }
});

// 2. عملیات برداشت (Withdraw)
document.getElementById("withdrawBtn").addEventListener("click", async () => {
    const provider = getProvider();
    const amount = document.getElementById("withdrawAmount").value;
    if (!amount || !account || !provider) { alert("Connect wallet and enter amount"); return; }
    
    const hexAmount = (parseFloat(amount) * 1e18).toString(16).padStart(64, '0');
    const data = "0x2e1a7d4d" + hexAmount; 

    try {
        txStatusP.innerText = "Sending withdraw transaction...";
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: account, to: contractAddress, data: data, value: '0x0' }],
        });
        txStatusP.innerText = `Withdraw Sent! Hash: ${txHash.substring(0,15)}...`;
        setTimeout(updateBalance, 5000);
    } catch (error) {
        txStatusP.innerText = "Withdraw failed.";
    }
});

connectBtn.addEventListener("click", connectWallet);