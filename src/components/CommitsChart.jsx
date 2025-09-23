import React, { useEffect, useState } from 'react'
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend, ResponsiveContainer } from 'recharts'
function CommitsChart({fullName,darkmode}) {
    const [commits,setCommits]=useState([]);
    useEffect(()=>{
        if(!fullName) return;
        const fetchCommits=async () =>{
            try{
                const res=await fetch(`https://api.github.com/repos/${fullName}/stats/commit_activity`);
                const data=await res.json();
                if(Array.isArray(data)){
                    const lastWeeks=data.slice(-12).map((week,idx)=>({
                        week:`W${idx+1}`,
                        commits:week.total,
                    }));
                    setCommits(lastWeeks);
                }
            }catch(err){
                console.error("Error fetching commit activity:",err);
            }
        };
        fetchCommits();
    },[fullName]);
    if(commits.length===0)return <p>No Commit activity data.</p>
  return (
    <div className={darkmode ?'bg-gray-700 text-white shadow-lg rounded-2xl p-4 mt-6':"bg-gray-100 text-gray-700 shadow-lg rounded-2xl p-4 mt-6"}>
        <h2 className='text-lg font-semibold mb-3'>
           Commit Activity (Last 12 Weeks)
        </h2>
        <ResponsiveContainer width="100%" height="85%">
        <LineChart data={commits}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
            <XAxis dataKey="week" stroke={darkmode? '#ccc':"#333"}/>
            <YAxis stroke={darkmode? '#ccc':"#333"}/>
            <Tooltip contentStyle={{backgroundColor:darkmode?'#1f2937':"#fff",borderRadius:'0.5rem',border:'none'}}
            labelStyle={{color:darkmode ?  '#fff': "#000"}}/>
            <Legend/>
            <Line type="monotone" dataKey="commits" stroke={darkmode? '#ccc':"#1d4ed8"}strokeWidth={2} dot={{r:4}} activeDot={{r:6}}/>    
        </LineChart>
        </ResponsiveContainer>
      
    </div>
  )
}

export default CommitsChart
