// import React, { useState } from 'react'
// import { motion } from "motion/react"
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import TopicForm from '../components/TopicForm'
// import Sidebar from '../components/Sidebar'
// import FinalResult from '../components/FinalResult'
// function Notes() {
//   const navigate = useNavigate()
//   const { userData } = useSelector((state) => state.user)
//   const credits = userData.credits
//   const [loading,setLoading]= useState(false)
//   const [result , setResult] = useState(null)
//   const [error,setError] = useState("")

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-8'>
//       <motion.header
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}

//         className=" mb-10
//             rounded-2xl
//             bg-black/80 backdrop-blur-xl
//             border border-white/10
//             px-8 py-6
//             shadow-[0_20px_45px_rgba(0,0,0,0.6)] items-start
//             flex md:items-center justify-between gap-4 flex-col md:flex-row"
//       >
//         <div onClick={() => navigate("/")} className='cursor-pointer'><h1 className='text-2xl font-bold
//             bg-linear-to-r from-white via-gray-300 to-white
//             bg-clip-text text-transparent'>ExamNotes AI</h1>
//           <p className='text-sm text-gray-300 mt-1'>AI-powered exam-oriented notes & revision</p></div>

//         <div className='flex items-center gap-4 flex-wrap'>
//           <button className='flex items-center gap-2 
//     px-4 py-2 rounded-full
//     bg-white/10
//     border border-white/20
//     text-white text-sm' onClick={() => navigate("/pricing")}>
//             <span className='text-xl'>💠</span>
//             <span>{credits}</span>
//             <motion.span whileHover={{ scale: 1.2 }}
//               whileTap={{ scale: 0.97 }}
//               className='ml-2 h-5 w-5 flex items-center justify-center
//                         rounded-full bg-white  text-xs font-bold'
//             >
//               ➕

//             </motion.span>


//           </button>
//           <button onClick={()=>navigate("/history")} className='px-4 py-3 rounded-full
//       text-sm font-medium
//       bg-white/10
//       border border-white/20
//       text-white
//       hover:bg-white/20
//       transition
//       flex items-center gap-2'>
//         📚 Your Notes


//           </button>
//         </div>


//       </motion.header>


//       <motion.div 
//           className="mb-12">
//         <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError}/>
//       </motion.div>


//       {loading && (
//           <motion.div
//             animate={{ opacity: [0.4, 1, 0.4] }}
//             transition={{ repeat: Infinity, duration: 1.2 }}
//             className="text-center text-black font-medium mb-6"
//           >
//             Generating exam-focused notes…
//           </motion.div>
//         )}

//         {error && (
//           <div className="mb-6 text-center text-red-600 font-medium">
//             {error}
//           </div>
//         )}

//     {!result && <motion.div whileHover={{ scale: 1.02 }}
//             className="
//               h-64
//               rounded-2xl
//               flex flex-col items-center justify-center
//               bg-white/60 backdrop-blur-lg
//               border border-dashed border-gray-300
//               text-gray-500
//               shadow-inner
//             ">
//                <span className="text-4xl mb-3">📘</span>
//             <p className="text-sm">
//               Generated notes will appear here
//             </p>

//      </motion.div>}


//     {result && <motion.div
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.4 }}
//      className='flex flex-col
//       lg:grid lg:grid-cols-4
//       gap-6'>

//         <div className='lg:col-span-1'>
//           <Sidebar result={result}/>


//         </div>

//         <div className='lg:col-span-3
//         rounded-2xl
//         bg-white
//         shadow-[0_15px_40px_rgba(0,0,0,0.15)]
//         p-6'>
//           <FinalResult result={result}/>

//         </div>


//     </motion.div>
// }
//     </div>
//   )
// }

// export default Notes







// import React, { useState } from 'react'
// import { motion } from "motion/react"
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import TopicForm from '../components/TopicForm'
// import Sidebar from '../components/Sidebar'
// import FinalResult from '../components/FinalResult'

// function Notes() {
//   const navigate = useNavigate()
//   const { userData } = useSelector((state) => state.user)
//   const credits = userData.credits
//   const [loading,setLoading]= useState(false)
//   const [result , setResult] = useState(null)
//   const [error,setError] = useState("")

//   return (
//     <div className='min-h-screen bg-gray-100 text-blue-900 px-6 py-8'>
      
//       {/* Header (Dark Blue) */}
//       <motion.header
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-10 rounded-2xl bg-blue-900 px-8 py-6 flex md:items-center justify-between gap-4 flex-col md:flex-row"
//       >
//         <div onClick={() => navigate("/")} className='cursor-pointer'>
//           <h1 className='text-2xl font-bold text-white'>ExamNotes AI</h1>
//           <p className='text-sm text-gray-200 mt-1'>AI-powered exam-oriented notes & revision</p>
//         </div>

//         <div className='flex items-center gap-4 flex-wrap'>
//           <button 
//             className='flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800 text-white text-sm'
//             onClick={() => navigate("/pricing")}
//           >
//             <span className='text-xl'>💠</span>
//             <span>{credits}</span>
//             <motion.span 
//               whileHover={{ scale: 1.2 }}
//               whileTap={{ scale: 0.97 }}
//               className='ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-xs font-bold text-blue-900'
//             >
//               ➕
//             </motion.span>
//           </button>

//           <button 
//             onClick={()=>navigate("/history")} 
//             className='px-4 py-3 rounded-full text-sm font-medium bg-blue-800 text-white flex items-center gap-2 hover:bg-blue-700 transition'
//           >
//             📚 Your Notes
//           </button>
//         </div>
//       </motion.header>

//       {/* Topic Form Section */}
//       <motion.div className="mb-12">
//         <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError}/>
//       </motion.div>

//       {/* Loading */}
//       {loading && (
//         <motion.div
//           animate={{ opacity: [0.4, 1, 0.4] }}
//           transition={{ repeat: Infinity, duration: 1.2 }}
//           className="text-center text-blue-900 font-medium mb-6"
//         >
//           Generating exam-focused notes…
//         </motion.div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="mb-6 text-center text-red-600 font-medium">
//           {error}
//         </div>
//       )}

//       {/* Placeholder for result */}
//       {!result && (
//         <motion.div 
//           whileHover={{ scale: 1.02 }}
//           className="h-64 rounded-2xl flex flex-col items-center justify-center bg-white border border-gray-300 text-gray-500"
//         >
//           <span className="text-4xl mb-3">📘</span>
//           <p className="text-sm">Generated notes will appear here</p>
//         </motion.div>
//       )}

//       {/* Result Section */}
//       {result && (
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className='flex flex-col lg:grid lg:grid-cols-4 gap-6'
//         >
//           <div className='lg:col-span-1'>
//             <Sidebar result={result}/>
//           </div>

//           <div className='lg:col-span-3 rounded-2xl bg-white p-6'>
//             <FinalResult result={result}/>
//           </div>
//         </motion.div>
//       )}

//     </div>
//   )
// }

// export default Notes




// import React, { useEffect, useState } from 'react'
// import { motion } from "motion/react"
// import { useDispatch } from 'react-redux';
// import { generateNotes } from '../services/api';
// import { updateCredits } from '../redux/userSlice';

// function TopicForm({ setResult, setLoading, loading, setError }) {
//   const [topic, setTopic] = useState("");
//   const [classLevel, setClassLevel] = useState("");
//   const [examType, setExamType] = useState("");
//   const [revisionMode, setRevisionMode] = useState(false);
//   const [includeDiagram, setIncludeDiagram] = useState(false);
//   const [includeChart, setIncludeChart] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [progressText, setProgressText] = useState("");
//   const dispatch = useDispatch();

//   const handleSubmit = async () => {
//     if (!topic.trim()) {
//       setError("Please enter the topic");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     setResult(null);

//     try {
//       const result = await generateNotes({
//         topic,
//         classLevel,
//         examType,
//         revisionMode,
//         includeDiagram,
//         includeChart
//       });

//       setResult(result.data);
//       setLoading(false);
//       setTopic("");
//       setClassLevel("");
//       setExamType("");
//       setRevisionMode(false);
//       setIncludeDiagram(false);
//       setIncludeChart(false);

//       if (typeof result.creditsLeft === "number") {
//         dispatch(updateCredits(result.creditsLeft));
//       }

//     } catch (error) {
//       console.log(error);
//       setError("Failed to fetch notes from server");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!loading) {
//       setProgress(0);
//       setProgressText("");
//       return;
//     }
//     let value = 0;

//     const interval = setInterval(() => {
//       value += Math.random() * 8;

//       if (value >= 95) {
//         value = 95;
//         setProgressText("Almost done…");
//         clearInterval(interval);
//       } else if (value > 70) {
//         setProgressText("Finalizing notes…");
//       } else if (value > 40) {
//         setProgressText("Processing content…");
//       } else {
//         setProgressText("Generating notes…");
//       }

//       setProgress(Math.floor(value));
//     }, 700);

//     return () => clearInterval(interval);

//   }, [loading]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="
//         w-full max-w-3xl mx-auto
//         rounded-2xl
//         bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900
//         border border-white/20
//         shadow-lg
//         p-8
//         space-y-6
//         text-white
//       "
//     >

//       <input
//         type="text"
//         className='w-full p-3 rounded-xl bg-blue-800/50 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400'
//         placeholder='Enter topic (e.g. Web Development)'
//         onChange={(e) => setTopic(e.target.value)}
//         value={topic}
//       />

//       <input
//         type="text"
//         className='w-full p-3 rounded-xl bg-blue-800/50 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400'
//         placeholder='Class / Level (e.g. Class 10)'
//         onChange={(e) => setClassLevel(e.target.value)}
//         value={classLevel}
//       />

//       <input
//         type="text"
//         className='w-full p-3 rounded-xl bg-blue-800/50 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400'
//         placeholder='Exam Type (e.g. CBSE, JEE, NEET)'
//         onChange={(e) => setExamType(e.target.value)}
//         value={examType}
//       />

//       <div className='flex flex-col md:flex-row gap-6'>
//         <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />
//         <Toggle label="Include Diagram" checked={includeDiagram} onChange={() => setIncludeDiagram(!includeDiagram)} />
//         <Toggle label="Include Charts" checked={includeChart} onChange={() => setIncludeChart(!includeChart)} />
//       </div>

//       <motion.button
//         onClick={handleSubmit}
//         whileHover={!loading ? { scale: 1.02 } : {}}
//         whileTap={!loading ? { scale: 0.95 } : {}}
//         disabled={loading}
//         className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition
//           ${loading ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//             : "bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-lg"}
//         `}
//       >
//         {loading ? "Generating Notes..." : "Generate Notes"}
//       </motion.button>

//       {loading && (
//         <div className='mt-4 space-y-2'>
//           <div className='w-full h-2 rounded-full bg-white/20 overflow-hidden'>
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ ease: "easeOut", duration: 0.6 }}
//               className='h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
//             />
//           </div>
//           <div className='flex justify-between text-xs text-gray-300'>
//             <span>{progressText}</span>
//             <span>{progress}%</span>
//           </div>
//           <p className='text-xs text-gray-300 text-center'>
//             This may take up to 2–5 minutes. Please don’t close or refresh the page.
//           </p>
//         </div>
//       )}

//     </motion.div>
//   )
// }

// function Toggle({ label, checked, onChange }) {
//   return (
//     <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
//       <motion.div
//         animate={{ backgroundColor: checked ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.15)" }}
//         transition={{ duration: 0.25 }}
//         className='relative w-12 h-6 rounded-full border border-white/20 backdrop-blur-lg'
//       >
//         <motion.div
//           layout
//           transition={{ type: "spring", stiffness: 500, damping: 30 }}
//           className='absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]'
//           style={{ left: checked ? "1.6rem" : "0.25rem" }}
//         />
//       </motion.div>
//       <span className={`text-sm transition-colors ${checked ? "text-green-300" : "text-gray-300"}`}>{label}</span>
//     </div>
//   )
// }

// export default TopicForm










import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'

function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData.credits
  const [loading,setLoading]= useState(false)
  const [result , setResult] = useState(null)
  const [error,setError] = useState("")

  return (
    <div className='min-h-screen bg-gray-100 px-6 py-8'>

      {/* Header Block */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-2xl bg-blue-900 px-8 py-6 flex md:items-center justify-between gap-4 flex-col md:flex-row shadow-lg"
      >
        <div onClick={() => navigate("/")} className='cursor-pointer'>
          <h1 className='text-2xl font-bold text-white'>SmartNotes AI</h1>
          <p className='text-sm text-gray-300 mt-1'>AI-powered exam-oriented notes & revision</p>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>
          <button 
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-blue-700 text-white text-sm'
            onClick={() => navigate("/pricing")}
          >
            <span className='text-xl'>💠</span>
            <span>{credits}</span>
            <motion.span 
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.97 }}
              className='ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-xs font-bold text-blue-900'
            >
              ➕
            </motion.span>
          </button>

          <button 
            onClick={()=>navigate("/history")} 
            className='px-4 py-3 rounded-full text-sm font-medium bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 transition'
          >
            📚 Your Notes
          </button>
        </div>
      </motion.header>

      {/* Topic Form Section */}
      <motion.div className="mb-12">
        <TopicForm 
          loading={loading} 
          setResult={setResult} 
          setLoading={setLoading} 
          setError={setError} 
        />
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-center text-gray-900 font-medium mb-6"
        >
          Generating exam-focused notes…
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 text-center text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Placeholder for result */}
      {!result && (
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="h-64 rounded-2xl flex flex-col items-center justify-center bg-white border border-gray-300 text-gray-500 shadow"
        >
          <span className="text-4xl mb-3">📘</span>
          <p className="text-sm">Generated notes will appear here</p>
        </motion.div>
      )}

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='flex flex-col lg:grid lg:grid-cols-4 gap-6 mt-6'
        >
          <div className='lg:col-span-1'>
            <Sidebar result={result}/>
          </div>

          <div className='lg:col-span-3 rounded-2xl bg-white p-6 shadow'>
            <FinalResult result={result}/>
          </div>
        </motion.div>
      )}

    </div>
  )
}

export default Notes