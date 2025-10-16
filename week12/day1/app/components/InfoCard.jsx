// components/InfoCard.jsx
export default function InfoCard({ title, value, icon: Icon, color = "indigo" }) {
  const colorClasses = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    red: "bg-red-50 border-red-200 text-red-700"
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={24} className="opacity-70" />}
        <div>
          <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{title}</p>
          <p className="text-lg font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}