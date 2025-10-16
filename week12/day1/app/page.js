// app/page.jsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";
import Header from "./components/Header";
import TokenInfo from "./components/TokenInfo";
import TransferSection from "./components/TransferSection";
import ApproveSection from "./components/ApproveSection";
import BurnSection from "./components/BurnSection";
import AdminControls from "./components/AdminControls";
import Toast from "./components/Toast";
import { Wallet } from "lucide-react";

export default function Page() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState(null);
  const [toast, setToast] = useState(null);

  const [balance, setBalance] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [decimals, setDecimals] = useState("18");
  const [paused, setPaused] = useState(false);
  const [owner, setOwner] = useState("");

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast("MetaMask not found. Please install MetaMask.", "error");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const network = await provider.getNetwork();
      setConnectedNetwork(`${network.name} (${network.chainId})`);
      setProvider(provider);
      setContract(contract);
      const address = await signer.getAddress();
      setAccount(address);
      showToast("Wallet connected successfully!", "success");
      await loadReadData(contract, address);
    } catch (err) {
      console.error(err);
      showToast("Failed to connect wallet", "error");
    }
  };

  const loadReadData = async (contract, address) => {
    try {
      const [bal, supply, dec, pausedState, own] = await Promise.all([
        contract.balanceOf(address),
        contract.totalSupply(),
        contract.decimals(),
        contract.paused(),
        contract.owner(),
      ]);
      setBalance(ethers.formatUnits(bal, dec));
      setTotalSupply(ethers.formatUnits(supply, dec));
      setDecimals(Number(dec));
      setPaused(pausedState);
      setOwner(own);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const withTx = async (fn, msg) => {
    try {
      setLoading(true);
      showToast(`${msg} pending...`, "info");
      const tx = await fn();
      await tx.wait();
      showToast(`${msg} successful!`, "success");
      await loadReadData(contract, account);
    } catch (err) {
      console.error(err);
      showToast(err.reason || err.message || `${msg} failed`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = (to, amount) => {
    withTx(() => contract.transfer(to, ethers.parseUnits(amount, decimals)), "Transfer");
  };

  const handleApprove = (spender, amount) => {
    withTx(() => contract.approve(spender, ethers.parseUnits(amount, decimals)), "Approval");
  };

  const handleCheckAllowance = async (owner, spender) => {
    try {
      const value = await contract.allowance(owner, spender);
      const formatted = ethers.formatUnits(value, decimals);
      showToast("Allowance fetched successfully!", "success");
      return formatted;
    } catch (err) {
      showToast("Error checking allowance", "error");
      return "";
    }
  };

  const handleBurn = (amount) => {
    withTx(() => contract.burn(ethers.parseUnits(amount, decimals)), "Burn");
  };

  const handleMint = (to, amount) => {
    withTx(() => contract.mint(to, ethers.parseUnits(amount, decimals)), "Mint");
  };

  const handlePause = () => {
    withTx(() => contract.pause(), "Pause");
  };

  const handleUnpause = () => {
    withTx(() => contract.unpause(), "Unpause");
  };

  const handleTransferOwnership = (newOwner) => {
    withTx(() => contract.transferOwnership(newOwner), "Ownership Transfer");
  };

  const handleRenounce = () => {
    withTx(() => contract.renounceOwnership(), "Renounce Ownership");
  };

  const isOwner = account && owner && account.toLowerCase() === owner.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header account={account} connectedNetwork={connectedNetwork} onConnect={connectWallet} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        {!account ? (
          <div className="text-center py-20">
            <Wallet size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500">Please connect your wallet to access the dashboard</p>
          </div>
        ) : (
          <div className="space-y-6">
            <TokenInfo 
              balance={balance}
              totalSupply={totalSupply}
              decimals={decimals}
              paused={paused}
              owner={owner}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransferSection onTransfer={handleTransfer} loading={loading} />
              <ApproveSection 
                onApprove={handleApprove}
                onCheckAllowance={handleCheckAllowance}
                loading={loading}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BurnSection onBurn={handleBurn} loading={loading} />
              
              {isOwner && (
                <AdminControls
                  onMint={handleMint}
                  onPause={handlePause}
                  onUnpause={handleUnpause}
                  onTransferOwnership={handleTransferOwnership}
                  onRenounce={handleRenounce}
                  paused={paused}
                  loading={loading}
                />
              )}
            </div>

            {!isOwner && account && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> Admin controls are only visible to the contract owner.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}