// components/TokenInfo.jsx
import InfoCard from "./InfoCard";
import { CheckCircle, XCircle } from "lucide-react";

export default function TokenInfo({ balance, totalSupply, decimals, paused, owner }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Token Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Your Balance" value={`${balance} ARB`} color="indigo" />
        <InfoCard title="Total Supply" value={`${totalSupply} ARB`} color="purple" />
        <InfoCard 
          title="Status" 
          value={paused ? "Paused" : "Active"} 
          icon={paused ? XCircle : CheckCircle}
          color={paused ? "red" : "green"} 
        />
        <InfoCard title="Decimals" value={decimals} color="blue" />
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-600 mb-1">Contract Owner</p>
        <p className="text-sm font-mono text-gray-800 break-all">{owner}</p>
      </div>
    </div>
  );
}