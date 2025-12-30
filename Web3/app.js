const contractAddress = "0xb2964b148dbB0C4b413d36c9cfdEf5571e7a97B1";

const abi = [
  {
    "inputs":[
      {"internalType":"string","name":"_productId","type":"string"},
      {"internalType":"address","name":"_owner","type":"address"},
      {"internalType":"uint256","name":"_durationDays","type":"uint256"}
    ],
    "name":"createWarranty",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"string","name":"_productId","type":"string"}],
    "name":"getWarranty",
    "outputs":[
      {"internalType":"address","name":"owner","type":"address"},
      {"internalType":"uint256","name":"startDate","type":"uint256"},
      {"internalType":"uint256","name":"endDate","type":"uint256"},
      {"internalType":"bool","name":"isActive","type":"bool"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[
      {"internalType":"string","name":"_productId","type":"string"},
      {"internalType":"address","name":"_newOwner","type":"address"}
    ],
    "name":"transferWarranty",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);

  document.getElementById("wallet").innerText =
    "Connected: " + await signer.getAddress();
}

// ---- Create Warranty ----
async function createWarranty() {
  const pid = document.getElementById("c_productId").value;
  const owner = document.getElementById("c_owner").value;
  const days = document.getElementById("c_days").value;

  try {
    const tx = await contract.createWarranty(pid, owner, days);
    await tx.wait();
    document.getElementById("createResult").innerText = "Warranty Created!";
  } catch (err) {
    document.getElementById("createResult").innerText = err.message;
  }
}

// ---- Get Warranty ----
async function getWarranty() {
  const pid = document.getElementById("g_productId").value;

  try {
    const w = await contract.getWarranty(pid);

    const start = new Date(w.startDate * 1000);
    const end = new Date(w.endDate * 1000);

    document.getElementById("getResult").innerText =
      `Owner: ${w.owner}
Start: ${start}
End: ${end}
Active: ${w.isActive}`;
  } catch (err) {
    document.getElementById("getResult").innerText = err.message;
  }
}

// ---- Transfer Warranty ----
async function transferWarranty() {
  const pid = document.getElementById("t_productId").value;
  const newOwner = document.getElementById("t_newOwner").value;

  try {
    const tx = await contract.transferWarranty(pid, newOwner);
    await tx.wait();
    document.getElementById("transferResult").innerText = "Transferred!";
  } catch (err) {
    document.getElementById("transferResult").innerText = err.message;
  }
}
