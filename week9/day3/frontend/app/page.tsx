"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Navbar from "../components/NavBar";
import { MessageCircle, TrendingUp, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 overflow-hidden">
      <Navbar />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="flex justify-center items-center flex-1 relative z-10 px-4">
        {token ? (
          // Logged In View
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="space-y-4">
              <div className="inline-block">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl mb-4 mx-auto animate-bounce-slow">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Welcome Back, <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">{user?.name || "Champion"}</span>!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Your cricket AI assistant is ready to answer all your cricket queries
              </p>
            </div>

            <button
              onClick={() => router.push("/chat")}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                Let's Chat 
                <Sparkles className="w-6 h-6" />
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <TrendingUp className="w-8 h-8 text-green-400 mb-2 mx-auto" />
                <h3 className="text-white font-semibold mb-1">Live Stats</h3>
                <p className="text-gray-300 text-sm">Real-time cricket data</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Zap className="w-8 h-8 text-yellow-400 mb-2 mx-auto" />
                <h3 className="text-white font-semibold mb-1">Instant Answers</h3>
                <p className="text-gray-300 text-sm">Lightning fast responses</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Shield className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                <h3 className="text-white font-semibold mb-1">Accurate Data</h3>
                <p className="text-gray-300 text-sm">Verified cricket info</p>
              </div>
            </div>
          </div>
        ) : (
          // Not Logged In View
          <div className="text-center space-y-8 max-w-4xl animate-fadeIn">
            <div className="space-y-6">
              <div className="inline-block animate-float">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-green-500 rounded-full shadow-2xl mx-auto">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Cricket AI <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Assistant</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your intelligent companion for cricket statistics, player insights, and match analytics
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <p className="text-gray-400 text-lg">Get started in seconds</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => router.push("/login")} 
                  className="group relative w-48 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Login</span>
                </button>
                <button 
                  onClick={() => router.push("/signup")} 
                  className="group relative w-48 bg-white/10 backdrop-blur-lg border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <span className="relative">Sign Up</span>
                </button>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Live Statistics</h3>
                <p className="text-gray-400">Access real-time cricket stats, scores, and player performance data</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Instant Answers</h3>
                <p className="text-gray-400">Get lightning-fast responses to all your cricket questions</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Verified Data</h3>
                <p className="text-gray-400">Trust in accurate and reliable cricket information</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}