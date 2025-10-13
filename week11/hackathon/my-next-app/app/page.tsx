'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { kasplexTestnet } from './providers';
import CONTRACT_ABI from './abi.json';

const CONTRACT_ADDRESS = '0x889246e2c91fAc91547Af28bc584fb870b931253';

export default function TodoApp() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = injected();

  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [clients, setClients] = useState<any>(null);

  // ✅ Initialize clients only in the browser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const publicClient = createPublicClient({
        chain: kasplexTestnet,
        transport: custom(window.ethereum),
      });

      const walletClient = createWalletClient({
        chain: kasplexTestnet,
        transport: custom(window.ethereum),
      });

      setClients({ publicClient, walletClient });
    }
  }, []);

  // ✅ Ensure correct chain
  async function ensureKasplexNetwork() {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId, 16) !== kasplexTestnet.id) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x28cc4' }], // 167012 in hex
        });
      } catch (switchError: any) {
        // If not added, request to add network
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x28cc4',
                chainName: 'Kasplex Testnet',
                nativeCurrency: { name: 'Kas', symbol: 'KAS', decimals: 18 },
                rpcUrls: ['https://rpc.kasplextest.xyz/'],
                blockExplorerUrls: ['https://testnet.kasplex.org'],
              },
            ],
          });
        }
      }
    }
  }

  async function loadTasks() {
    if (!clients) return;
    try {
      const result = await clients.publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getAllTasks',
      });
      setTasks(result as any[]);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  }

  async function addTask() {
    if (!newTask.trim() || !clients) return;
    await ensureKasplexNetwork();
    await clients.walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'createTask',
      args: [newTask],
      account: address!,
    });
    setNewTask('');
    loadTasks();
  }

  async function toggleTask(id: number) {
    if (!clients) return;
    await ensureKasplexNetwork();
    await clients.walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'toggleTask',
      args: [id],
      account: address!,
    });
    loadTasks();
  }

  useEffect(() => {
    if (isConnected && clients) loadTasks();
  }, [isConnected, clients]);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl text-pink-700 font-bold mb-4">📝 Decentralized Todo List</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-3 text-gray-600">Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-3 py-1 rounded mb-5"
          >
            Disconnect
          </button>

          <div className="flex gap-2 mb-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task"
              className="border px-3 py-2 rounded w-64"
            />
            <button onClick={addTask} className="bg-green-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>

          <ul className="w-80">
            {tasks.map((task: any, index) => (
              <li key={index} className="flex justify-between mb-2 border-b pb-1 items-center">
                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                  {task.description}
                </span>
                <button
                  onClick={() => toggleTask(Number(task.id))}
                  className="text-sm text-blue-500"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
