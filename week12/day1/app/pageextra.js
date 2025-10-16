// "use client";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { TOKEN_ABI, TOKEN_ADDRESS } from "./config";
// import { Wallet, Send, Shield, Eye, ArrowLeftRight } from "lucide-react";

// export default function Home() {
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [tokenName, setTokenName] = useState("");
//   const [symbol, setSymbol] = useState("");
//   const [balance, setBalance] = useState("");
//   const [decimals, setDecimals] = useState(18);

//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [spender, setSpender] = useState("");
//   const [approveAmount, setApproveAmount] = useState("");
//   const [allowanceValue, setAllowanceValue] = useState("");
//   const [from, setFrom] = useState("");
//   const [transferFromRecipient, setTransferFromRecipient] = useState("");
//   const [transferFromAmount, setTransferFromAmount] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const isNumericString = (s) => {
//     if (typeof s !== "string") return false;
//     const trimmed = s.trim();
//     if (trimmed === "") return false;
//     return /^-?\d+(\.\d+)?$/.test(trimmed);
//   };

//   const ensureAddress = (addr) => {
//     try {
//       ethers.getAddress(addr);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const network = await provider.getNetwork();

//       if (network.chainId !== 11155111n) {
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0xaa36a7" }],
//         });
//       }

//       const address = await signer.getAddress();
//       setAccount(address);

//       const c = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
//       setContract(c);

//       await fetchData(c, address);
//       setMessage("Wallet connected!");
//       setTimeout(() => setMessage(""), 2500);
//     } catch (err) {
//       console.error("Error connecting wallet:", err);
//       alert("Failed to connect wallet: " + err.message);
//     }
//   };

//   const fetchData = async (c, address) => {
//     try {
//       const [_name, _symbol, _decimals, _balance] = await Promise.all([
//         c.name(),
//         c.symbol(),
//         c.decimals(),
//         c.balanceOf(address),
//       ]);

//       setTokenName(_name);
//       setSymbol(_symbol);
//       setDecimals(Number(_decimals));
//       setBalance(ethers.formatUnits(_balance, _decimals));
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       alert("Error fetching token data: " + err.message);
//     }
//   };

//   const sendTokens = async () => {
//     if (!contract) return alert("Connect wallet first");
//     if (!ensureAddress(recipient)) return alert("Invalid recipient address");
//     if (!isNumericString(amount)) return alert("Enter a valid amount");

//     try {
//       setLoading(true);
//       setMessage("Confirm in MetaMask...");
//       const amountInWei = ethers.parseUnits(amount.trim(), decimals ?? 18);
//       const tx = await contract.transfer(recipient, amountInWei);
//       setMessage("Processing transaction...");
//       await tx.wait();
//       setMessage("Transfer complete!");
//       await fetchData(contract, account);
//       setRecipient("");
//       setAmount("");
//     } catch (err) {
//       console.error("Error transferring tokens:", err);
//       setMessage("Transfer failed: " + err.message);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const approveSpender = async () => {
//     if (!contract) return alert("Connect wallet first");
//     if (!ensureAddress(spender)) return alert("Invalid spender address");
//     if (!isNumericString(approveAmount)) return alert("Enter valid amount");

//     try {
//       setLoading(true);
//       setMessage("Confirm in MetaMask...");
//       const amountInWei = ethers.parseUnits(approveAmount.trim(), decimals ?? 18);
//       const tx = await contract.approve(spender, amountInWei);
//       setMessage("Processing transaction...");
//       await tx.wait();
//       setMessage("Approved!");
//     } catch (err) {
//       console.error("Error approving spender:", err);
//       setMessage("Approval failed: " + err.message);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const checkAllowance = async () => {
//     if (!contract) return alert("Connect wallet first");
//     if (!ensureAddress(spender)) return alert("Enter spender address to check");

//     try {
//       setLoading(true);
//       setMessage("Fetching allowance...");
//       const allowed = await contract.allowance(account, spender);
//       setAllowanceValue(ethers.formatUnits(allowed, decimals ?? 18));
//       setMessage("Allowance: " + ethers.formatUnits(allowed, decimals ?? 18) + " " + symbol);
//     } catch (err) {
//       console.error("Error checking allowance:", err);
//       setMessage("Error checking allowance: " + err.message);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const transferFromFunc = async () => {
//     if (!contract) return alert("Connect wallet first");
//     if (!ensureAddress(from)) return alert("Invalid from address");
//     if (!ensureAddress(transferFromRecipient)) return alert("Invalid to address");
//     if (!isNumericString(transferFromAmount)) return alert("Enter a valid amount");

//     try {
//       setLoading(true);
//       setMessage("Confirm in MetaMask...");
//       const amountInWei = ethers.parseUnits(transferFromAmount.trim(), decimals ?? 18);
//       const tx = await contract.transferFrom(from, transferFromRecipient, amountInWei);
//       setMessage("Processing transaction...");
//       await tx.wait();
//       setMessage("Transfer complete!");
//       setFrom("");
//       setTransferFromRecipient("");
//       setTransferFromAmount("");
//     } catch (err) {
//       console.error("Error in transferFrom:", err);
//       setMessage("transferFrom failed: " + err.message);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on("chainChanged", () => window.location.reload());
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
//       <div className="max-w-2xl mx-auto">
        
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-1">
//             {tokenName ? `${tokenName} (${symbol})` : "ERC-20 DApp"}
//           </h1>
//           <p className="text-gray-500">Token Interface</p>
//         </div>

//         {!account ? (
//           <div className="bg-white rounded-lg shadow p-8 mb-6">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
//                 <Wallet className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">Connect Wallet</h2>
//                 <p className="text-sm text-gray-500">Connect to get started</p>
//               </div>
//             </div>
//             <button
//               onClick={connectWallet}
//               className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//             >
//               Connect
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg shadow-lg p-5 mb-6 text-white">
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <p className="text-sm text-indigo-100 mb-1">Address</p>
//                   <p className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-indigo-100 mb-1">Balance</p>
//                   <p className="text-2xl font-semibold">{balance || "0"} {symbol}</p>
//                 </div>
//               </div>
//             </div>

//             {message && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
//                 {loading && <span className="inline-block mr-2">⏳</span>}
//                 {message}
//               </div>
//             )}

//             <div className="space-y-6">
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Send className="w-5 h-5 text-gray-700" />
//                   <h3 className="text-lg font-semibold text-gray-800">Transfer</h3>
//                 </div>
//                 <div className="space-y-3">
//                   <input
//                     placeholder="Recipient address"
//                     value={recipient}
//                     onChange={(e) => setRecipient(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <input
//                     placeholder="Amount"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <button
//                     onClick={sendTokens}
//                     disabled={!ensureAddress(recipient) || !isNumericString(amount) || loading}
//                     className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Processing..." : "Send"}
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Shield className="w-5 h-5 text-gray-700" />
//                   <h3 className="text-lg font-semibold text-gray-800">Approve</h3>
//                 </div>
//                 <div className="space-y-3">
//                   <input
//                     placeholder="Spender address"
//                     value={spender}
//                     onChange={(e) => setSpender(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <input
//                     placeholder="Amount"
//                     value={approveAmount}
//                     onChange={(e) => setApproveAmount(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <button
//                     onClick={approveSpender}
//                     disabled={!ensureAddress(spender) || !isNumericString(approveAmount) || loading}
//                     className="w-full bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cyan-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Processing..." : "Approve"}
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Eye className="w-5 h-5 text-gray-700" />
//                   <h3 className="text-lg font-semibold text-gray-800">Check Allowance</h3>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-3">View approved spending limit for an address</p>
//                 <button
//                   onClick={checkAllowance}
//                   disabled={!ensureAddress(spender) || loading}
//                   className="w-full bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Checking..." : "Check"}
//                 </button>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <ArrowLeftRight className="w-5 h-5 text-gray-700" />
//                   <h3 className="text-lg font-semibold text-gray-800">Transfer From</h3>
//                 </div>
//                 <div className="space-y-3">
//                   <input
//                     placeholder="From address"
//                     value={from}
//                     onChange={(e) => setFrom(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <input
//                     placeholder="To address"
//                     value={transferFromRecipient}
//                     onChange={(e) => setTransferFromRecipient(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <input
//                     placeholder="Amount"
//                     value={transferFromAmount}
//                     onChange={(e) => setTransferFromAmount(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//                     disabled={loading}
//                   />
//                   <button
//                     onClick={transferFromFunc}
//                     disabled={!ensureAddress(from) || !ensureAddress(transferFromRecipient) || !isNumericString(transferFromAmount) || loading}
//                     className="w-full bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Processing..." : "Transfer"}
//                   </button>
//                 </div>
//               </div>

//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }