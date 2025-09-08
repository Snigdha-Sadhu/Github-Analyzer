import { useState,useEffect } from 'react'
import axios from "axios";
import AiInsights from './components/AiInsights';
import LanguagesChart from './components/LanguagesChart';
import CommitsChart from './components/CommitsChart';
import ContributorsChart from './components/ContributorsChart';


function App() {
  const [username,setUsername]=useState("");
  const[repo,setRepo]=useState("");
  const[repodata,setRepoData]=useState(null);
  const[languages,setLanguages]=useState(null);
  const[contributors,setContributors]=useState(null);
  const[isOffline,setIsOffline]=useState(!navigator.onLine);
  const[darkmode,setdarkmode]=useState(false);
  const[error,setError]=useState("");
  useEffect(()=>{
    const goOnline=()=>setIsOffline(false);
    const goOffline=()=>setIsOffline(true);
    window.addEventListener('online',goOnline);
    window.addEventListener('offline',goOffline);
    return ()=>{
      window.removeEventListener('online',goOnline);
      window.removeEventListener('offline',goOffline);

    };
    
  },[]);
  const fetchRepoData=async () =>{
    console.log("username:",username);
    console.log("username:",repo)

    try{
      setError("");
      setRepoData(null);
      const repoRes=await axios.get(
        `https://api.github.com/repos/${username}/${repo}`
      );
       const langRes=await axios.get(
        `https://api.github.com/repos/${username}/${repo}/languages` 
      );
       const contribRes=await axios.get(
        `https://api.github.com/repos/${username}/${repo}/contributors` 
      );
    setRepoData(repoRes.data);
     setLanguages(langRes.data);
      setContributors(contribRes.data);
localStorage.setItem("lastRepoData",JSON.stringify({
  repo:repoRes.data,
  languages:langRes.data,
  contributors:contribRes.data
}));
    }
    catch(err){
      if(!navigator.onLine){
        const cached=localStorage.getItem("lastRepoData");
        if(cached){
          const parsed=JSON.parse(cached);
          setRepoData(parsed.repo);
          setLanguages(parsed.languages);
          setContributors(parsed.contributors);
          setError("you are offline.Showing last saved repo data");
        }else{
          setError("you are offline and no cached data available.");
        }
        
      }else{
      setError("Repository not found.please  check the username/repo name.");
      }
    }
  };

  return (
    <div className={darkmode ? ' min-w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6 overflow-x-hidden overflow-y-hidden': "bg-white text-black min-w-screen min-h-screen flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden p-6 "}>
      <div className='flex justify-center md:gap-2 gap-1 mt-10'>
      
      <h1 className='md:text-3xl text-xl font-extrabold text-trasparent bg-clip-text bg-gradient-to-r from -blue-600 to-indigo-600 text-blue-600 mb-6'>
       🚀 Github Repository Analyzer
</h1>
<button onClick={()=>setdarkmode(!darkmode)} className={darkmode?'px-1 h-8  bg-lime-700 rounded-full bg-gradient-to-r from-yellow-100 via-yellow-200 to yellow-400  text-white shadow-lg ':"px-1 h-8 rounded-full  bg-gradient-to-br from-gray-900 to-gray-800 to yellow-400  text-white shadow-lg  "}>{darkmode ?"☀️":"🌙"}</button>
</div>
<div className='flex mt-2 md:flex-row flex-col gap-2 mb-4 '>
  <input type="text" placeholder='Github Username' value={username} onChange={(e)=>setUsername(e.target.value)}
  className={darkmode?'border rounded-lg px-3 py-2 bg-gray-800  text-white focus:outline-none focus:ring-blue-400':'border rounded-lg px-3 py-2 text-black bg-white focus:outline-none focus:ring-blue-400'}/>
  <input type="text" placeholder='Repository Name' value={repo} onChange={(e)=>setRepo(e.target.value)}
  className={darkmode ? 'border rounded-lg px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-blue-400': 'border rounded-lg px-3 py-2 bg-white text-black focus:outline-none focus:ring-blue-400'}/>
  
  <button onClick={fetchRepoData} className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition'>Analyze</button>

</div>
{/*Error*/}
{repodata && (
  <div className={darkmode ? 'bg-gray-700 text-gray-100 shadow-lg rounded-xl p-6 w-full max-w-md text-left':"bg-zinc-100 text-zinc-700 shadow-lg rounded-xl p-6 w-full max-w-md text-left "}>
    <h2 className='text-xl font-semibold mb-2'>{repodata.full_name}</h2>
    <p className={darkmode ? 'text-gray-100 mb-4':"text-gray-800 mb-4"}>{repodata.description}</p>
    <ul className='space-y-1'>
      <li>⭐Stars:{repodata.stargazers_count}</li>
       <li>🍴Forks:{repodata.forks_count}</li>
        <li>🐞Open Issues:{repodata.open_issues_count}</li>
         <li>👀Wathers:{repodata.subscribers_count}</li>
          <li>💻License:{repodata.license? repodata.license.name:"No license specified"}</li>

    </ul>
    <a href={repodata.html_url}
    target="_blank"
    rel="noreferrer"
    className='inline-block mt-4 text-blue-500 hover:underline'>View On Github</a>
    </div>
)}
{isOffline &&(
  <div className='mb-3 rounded-md bg-yellow-100 text-sm text-yellow-800 w-[320px] py-2'>..you are offline.cached repo data may be shown..
    </div>
)}
{error && <p className='text-red-500'>{error}</p>}
{/*Ai Insights Component */}
{repodata && (
<AiInsights darkmode={darkmode} repodata={repodata} languages={languages} contributors={contributors}/>
)}
{repodata && (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
<LanguagesChart languages={languages}darkmode={darkmode}/>
<CommitsChart fullName={repodata.full_name}darkmode={darkmode}/>
<ContributorsChart fullName={repodata.full_name}darkmode={darkmode}/>
</div>
)}
    </div>
  );
};

export default App
