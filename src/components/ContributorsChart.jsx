import React from 'react'
import { useEffect,useState } from 'react';

import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);
function ContributorsChart({fullName}) {
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
            backgroundColor:"#3b82f6",
            borderColor:'#1d4ed8',
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
                color:'#f9fafb'
            },
        },
        
        title:{display:true,text:"Top Contributors",
            color:'#f9fafb' ,font:{
           size:16,
           weight:"bold",
            }
        },
    },
    scales:{
         y:{
            
           
            ticks:{
                color:"#e5e7eb",
               
            },
            grid:{
                color:"rgba(255,255,255,0.2)"
            },
        },
        x:{
            ticks:{
                color:'#e5e7eb',
                 maxRotation:60,
                minRotation:45
            },
            grid:{
                color:'rgba(255,255,255,0.2)'
            },
        },
       
    },
};
  return (
    <div className=' bg-gray-800 shadow-md rounded-lg p-4 mt-6  overflow-x-auto'>
        <div className={`min-w-[${contributors.length*80}px]`}></div>
        <Bar data={data} options={options}/>
      
    </div>
  );
}

export default ContributorsChart
