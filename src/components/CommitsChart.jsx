import React, { useEffect, useState } from 'react'
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend } from 'recharts'
function CommitsChart({fullName}) {
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
    <div className='bg-gray-700 text-white shadow-lg rounded-2xl p-4 mt-6'>
        <h2 className='text-lg font-semibold mb-3'>
           Commit Activity (Last 12 Weeks)
        </h2>
        <LineChart width={500} height={300} data={commits}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
            <XAxis dataKey="week" stroke="#ccc"/>
            <YAxis stroke='#ccc'/>
            <Tooltip contentStyle={{backgroundColor:'#1f2937',borderRadius:'0.5rem',border:'none'}}
            labelStyle={{color:'#fff'}}/>
            <Legend/>
            <Line type="monotone" dataKey="commits" stroke="#4ade80" strokeWidth={2}/>    
        </LineChart>
      
    </div>
  )
}

export default CommitsChart
