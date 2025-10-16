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

  async function ensureKasplexNetwork() {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId, 16) !== kasplexTestnet.id) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x28cc4' }],
        });
      } catch (switchError: any) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden p-6">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-40"></div>
                <div className="relative bg-white border-2 border-purple-300 rounded-3xl px-12 py-16 shadow-2xl">
                  <div className="text-7xl mb-6">🔐</div>
                  <h1 className="text-4xl font-black text-gray-800 mb-3">
                    CHAIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">TASK</span>
                  </h1>
                  <p className="text-gray-600 mb-8 max-w-xs">Immutable tasks on Kasplex blockchain</p>
                  <button
                    onClick={() => connect({ connector })}
                    className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="relative z-10">CONNECT WALLET</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Header Card */}
              <div className="bg-white border border-purple-200 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/40 to-transparent rounded-full blur-2xl"></div>
                <h1 className="text-3xl font-black text-gray-800 mb-2 relative">
                  CHAIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">TASK</span>
                </h1>
                <p className="text-gray-500 text-sm relative">Blockchain Todo System</p>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-300 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl shadow-md">
                    🔗
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-700 uppercase tracking-wider font-semibold">Wallet</p>
                    <p className="text-gray-800 font-mono text-sm truncate font-semibold">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-blue-200 rounded-xl p-4 text-center relative overflow-hidden group hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-2xl font-black text-blue-600 relative">{tasks.length}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider relative font-semibold">Total</p>
                </div>
                <div className="bg-white border border-green-200 rounded-xl p-4 text-center relative overflow-hidden group hover:border-green-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-2xl font-black text-green-600 relative">{tasks.filter(t => t.completed).length}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider relative font-semibold">Done</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-xl p-4 text-center relative overflow-hidden group hover:border-orange-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="text-2xl font-black text-orange-600 relative">{tasks.filter(t => !t.completed).length}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider relative font-semibold">Open</p>
                </div>
              </div>

              {/* Network Info */}
              <div className="bg-white/80 border border-gray-300 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Kasplex Testnet</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8">
              {/* Add Task Section */}
              <div className="bg-white border border-purple-200 rounded-2xl p-6 mb-6 shadow-lg">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Create New Task
                </label>
                <div className="flex gap-3">
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Enter task description..."
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200 placeholder-gray-500"
                  />
                  <button
                    onClick={addTask}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {tasks.length === 0 ? (
                  <div className="bg-white/60 border border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-md">
                    <div className="text-6xl mb-4 opacity-40">📝</div>
                    <p className="text-gray-500 text-lg">No tasks on chain yet</p>
                  </div>
                ) : (
                  tasks.map((task: any, index) => (
                    <div
                      key={index}
                      className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl ${
                        task.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-purple-500'
                      }`}
                    >
                      <div className={`absolute inset-0 opacity-5 ${
                        task.completed ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      
                      <div className="relative p-5 flex items-center gap-4">
                        <button
                          onClick={() => toggleTask(Number(task.id))}
                          className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-400 hover:border-purple-500 bg-gray-50'
                          }`}
                        >
                          {task.completed && <span className="text-white text-sm font-bold">✓</span>}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-base transition-all duration-300 ${
                            task.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-800 font-medium'
                          }`}>
                            {task.description}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-1">ID: #{String(task.id)}</p>
                        </div>

                        <div className={`flex-shrink-0 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          task.completed
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-purple-100 text-purple-700 border border-purple-300'
                        }`}>
                          {task.completed ? 'Complete' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}