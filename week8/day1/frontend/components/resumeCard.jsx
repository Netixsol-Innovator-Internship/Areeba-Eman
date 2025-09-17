export default function ResumeCard({ resume }) {
  return (
    <div className="w-52 h-64 bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-white hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
      <h2 className="text-xl font-bold text-white truncate">{resume.title}</h2>
      {resume.summary && (
        <p className="text-gray-400 mt-2 text-sm line-clamp-3">{resume.summary}</p>
      )}
    </div>
  );
}
