import React from 'react'
import { useEffect,useState } from 'react';

import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);
function ContributorsChart({fullName,darkmode}) {
    const[contributors,setContributors]=useState([]);
    useEffect(()=>{
    const fetchContributors=async ()=>{
        try{
             const response=await fetch(
                `https://api.github.com/repos/${fullName}/contributors?per_page=50` ,
                {
                    headers:{
                        Authorization:`token${import.meta.env.VITE_GITHUB_TOKEN}`
                    },
                
                }
            );
            if(!response.ok){
            throw new Error(`Github error:${response.status}`);
            }
        
            const data=await response.json();
            console.log("contributors fetched:",data.length,data);
             setContributors(data);
           
        }catch(err){
            console.error("Error Fetching contributors:",err);
        }
    };
    if(fullName) fetchContributors();
},[fullName]);
console.log(contributors);
if(!contributors.length) return <p>No Contributors data available.</p>;
const topcontributors=[...contributors].sort((a,b)=>b.contributions-a.contributions).slice(0,10);
const data={
    labels:contributors.map((c)=>c.login),
    datasets:[
        {
            label:"Commits",
            data:topcontributors.map((c)=>c.contributions),
            backgroundColor:darkmode ? "#4ade80":"#3b82f6",
            borderColor:darkmode ? "#22c55e":'#1d4ed8',
            borderWidth:1,
        },
    ],
};
console.log(data);
const options={
    responsive:true,
    plugins:{
        legend:{position:"top",
            lebels:{
                color:darkmode ?'#f9fafb':"#333",
            },
        },
        
        title:{display:true,text:"Top Contributors",
            color:darkmode ?'#f9fafb' :"#333",font:{
           size:16,
           weight:"bold",
            }
        },
    },
    scales:{
         y:{
            
           
            ticks:{
                color:darkmode ?"#e5e7eb":"#333",
               
            },
            grid:{
                color:darkmode ?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)"
            },
        },
        x:{
            ticks:{
                color:darkmode?'#e5e7eb':"#333",
                 maxRotation:90,
                minRotation:45
            },
            grid:{
                color:darkmode ?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.2)'
            },
        },
       
    },
};
  return (
    <div className={darkmode?' bg-gray-800 shadow-md rounded-lg p-4 mt-6  overflow-x-auto h-[400px] w-full':"text-gray-800  bg-gray-100 shadow-md rounded-lg p-4 mt-6  overflow-x-auto h-[300px] w-full mb-20"}>
        
        <Bar data={data} options={options}/>
        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6'>
            {contributors.slice(0,6).map((contributor)=>(
                <a key={contributor.id}  href={contributor.html_url} target="blank"rel="noopener noreferrer" className='flex flex-cool items-center'>
                    <img src={contributor.avatar_url} alt={contributor.login} className='w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600'/>
                    <span className='mt-2 text-sm'>{contributor.login}</span>
                </a>
            ))}
        </div>
      
    </div>
  );
}

export default ContributorsChart
