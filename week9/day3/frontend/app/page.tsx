'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/chat');
    else router.push('/login');
  }, []);

  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}

// 'use client';

// import { useState } from 'react';
// import { useAskQuestionMutation } from '../redux/services/cricketApi';

// export default function HomePage() {
//   const [question, setQuestion] = useState('');
//   const [askQuestion, { data, isLoading, error }] = useAskQuestionMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!question.trim()) return;
    
//     try {
//       const res = await askQuestion({ question }).unwrap();
//       console.log("AI Answer:", res);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

// return (
//   <main className="relative min-h-screen flex flex-col bg-blue-100 items-center justify-center p-6 overflow-hidden">

//     {/* Main Content */}
//     <div className="relative z-10 flex flex-col items-center w-full">
//       <h1 className="text-4xl font-extrabold mb-6 text-blue-800 drop-shadow-lg animate-fade-in">
//         🏏 Cricket Q&A
//       </h1>

//       {/* Input Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-2xl flex gap-3 animate-slide-up"
//       >
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask something about cricket..."
//           className="flex-1 px-5 py-3 border border-white rounded-xl shadow-md text-blue-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
//         />
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition disabled:bg-gray-400"
//         >
//           {isLoading ? "Asking..." : "Ask"}
//         </button>
//       </form>

//       {/* Error */}
//       <div className="mt-6 w-full max-w-3xl flex justify-center">
//         {error && (
//           <p className="text-red-600 font-medium animate-fade-in">
//             ❌ Something went wrong. Please try again.
//           </p>
//         )}
//       </div>

//       {/* Answer */}
//       {data && data.answer && (
//         <div className="p-6 bg-white rounded-2xl shadow-xl mt-8 w-full max-w-6xl animate-fade-slide">
//           {Array.isArray(data.answer) ? (
//             (() => {
//               const firstItem = data.answer[0];

//               if (firstItem?.error) {
//                 return (
//                   <p className="text-red-600 font-semibold animate-fade-in">
//                     {firstItem.error}
//                   </p>
//                 );
//               } else if (firstItem?.count !== undefined) {
//                 return (
//                   <p className="text-lg font-semibold text-gray-700 animate-fade-in">
//                     Total Count:{" "}
//                     <span className="text-blue-600">{firstItem.count}</span>
//                   </p>
//                 );
//               } else if (firstItem?.team && firstItem?.opposition) {
//                 return (
//                   <div className="overflow-x-auto flex justify-center">
//                     <table className="min-w-full border-collapse border border-gray-300 rounded-xl shadow-sm">
//                       <thead>
//                         <tr className="bg-blue-100 text-blue-900">
//                           <th className="px-4 py-2 border">#</th>
//                           <th className="px-4 py-2 border">Team</th>
//                           <th className="px-4 py-2 border">Opposition</th>
//                           <th className="px-4 py-2 border">Score</th>
//                           <th className="px-4 py-2 border">Overs</th>
//                           <th className="px-4 py-2 border">RPO</th>
//                           <th className="px-4 py-2 border">Innings</th>
//                           <th className="px-4 py-2 border">Result</th>
//                           <th className="px-4 py-2 border">Ground</th>
//                           <th className="px-4 py-2 border">Start Date</th>
//                           <th className="px-4 py-2 border">Type</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {data.answer.map((m: any, i: number) => (
//                           <tr
//                             key={i}
//                             className={`${
//                               i % 2 === 0 ? "bg-gray-50" : "bg-white"
//                             } hover:bg-blue-50 transition  text-blue-800`}
//                           >
//                             <td className="px-4 py-2 border text-center font-medium">
//                               {i + 1}
//                             </td>
//                             <td className="px-4 py-2 border">{m.team}</td>
//                             <td className="px-4 py-2 border">{m.opposition}</td>
//                             <td className="px-4 py-2 border">{m.score}</td>
//                             <td className="px-4 py-2 border">{m.overs}</td>
//                             <td className="px-4 py-2 border">{m.rpo}</td>
//                             <td className="px-4 py-2 border">{m.innings}</td>
//                             <td className="px-4 py-2 border">{m.result}</td>
//                             <td className="px-4 py-2 border">{m.ground}</td>
//                             <td className="px-4 py-2 border">
//                               {m.startDate
//                                 ? new Date(m.startDate).toLocaleDateString()
//                                 : ""}
//                             </td>
//                             <td className="px-4 py-2 border">{m.type}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 );
//               } else {
//                 return data.answer.map((item: any, idx: number) => (
//                   <p key={idx} className="text-gray-700 animate-fade-in">
//                     {Object.entries(item).map(([key, value]) => (
//                       <span key={key} className="block">
//                         <span className="font-semibold">{key}</span>:{" "}
//                         {typeof value === "object"
//                           ? JSON.stringify(value)
//                           : String(value)}
//                       </span>
//                     ))}
//                   </p>
//                 ));
//               }
//             })()
//           ) : (
//             <p className="text-lg text-gray-800 animate-fade-in">
//               {String(data.answer)}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   </main>
// );

// }
