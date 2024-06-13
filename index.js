import { ethers, providers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const sendEther = document.getElementById("sendEth");
const balances = document.getElementById("balance");
const win = document.getElementById("winner");
connectButton.onclick = connect;
sendEther.onclick = sendEth;
balances.onclick = getBalance;
win.onclick = GetWithdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    document.getElementById("connectButton").innerText = "connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    alert("Install metamask from https://metamask.io/download/!");
    document.getElementById("connectButton").value = "";
    document.getElementById("connectButton").focus();
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new providers.Web3Provider(window.ethereum);
    const bal = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(bal));
    document.getElementById("H1").innerText = ethers.utils.formatEther(bal);
  }
}

async function GetWithdraw() {
  console.log("Withdrawing ....");
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const transactionResponse = await contract.getWinner();
    await listenForTransactionMine(transactionResponse, provider);
    check();
    getBalance();
  } catch (error) {
    console.log(error);
  }
}

async function sendEth() {
  const ethAmount = "0.01";

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.sendEth({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
      check();
      getBalance();
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

function check() {
  alert("Done");
}
