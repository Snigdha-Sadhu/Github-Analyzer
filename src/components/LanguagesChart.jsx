import React from 'react'
import { PieChart,Pie,Cell,Tooltip,Legend } from 'recharts'
const colors=["#0088FE","#00C49F","#FFBB28","#FF8042","#8884d8","#82ca9d"];

function LanguagesChart({languages}) {
    if(!languages || Object.keys(languages).length===0){
        return <p>No language data  available.</p>;
    }
    const data=Object.entries(languages).map(([name,value])=>({
        name,
        value,
    }));
  return (
    <div className='bg-gray-700 shadow-lg rounded-2xl p-4 mt-6'>
        <h2 className='text-lg text-gray-100 font-semibold mb-3'>
           Language Composition   
        </h2>
      <PieChart width={400} height={300}>
        <Pie data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label>
            {data.map((entry,index)=>(
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
            ))}
        </Pie>
        <Tooltip/>
        <Legend/>
      </PieChart>
    </div>
  );
}

export default LanguagesChart
