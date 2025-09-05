 import React, { useState } from 'react' 



function AiInsights({repodata,languages,contributors}) {
    
    const[insight,setInsight]=useState("");
    const[loading,setLoading]=useState(false);
    const generateInsights=async()=>{
        setLoading(true);
        setInsight("");

    
        try{
           const response=await fetch("http://localhost:5000/api/generate",
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ repodata,languages,contributors}),
            });
          
          const data=await response.json();
        
          setInsight(data.insight||"No insights generated.");

        }catch(error){
            console.error("Error generating insights:",error);
            setInsight("could not generating  AI insights.try again");

        }finally{
        setLoading(false);
        }
    };

  return (
    <div className=' bg-gray-700 text-gray-100 p-4 rounded-lg border mt-6 '>
        <h2 className='text-lg font-semibold mb-2'>AI insights</h2>
        <button onClick={generateInsights} disabled={loading} className='bg-green-500 text-gray-100 px-4 py-2 rounded hover:bg-green-700'>{loading ? "Generating..." : "Generate Ai Insights"}</button>
       
        
           {insight && (
            <p className='mt-4 
            bg-gray-700
            text-grey-100 whitespace-pre-line'>{insight}</p>
            )}    
    
      
    </div>
  );
}

export default AiInsights
