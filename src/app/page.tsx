'use client'
import { useEffect, useState } from "react";

export default function Home() {
  
  const [data, setData] = useState<any[]>([]);
  
  useEffect(()=>{

    const fetchData = async()=>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
      const jsonData = await res.json();

      setData(jsonData)
    }

    fetchData();

  },[])

  console.log(data)
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}
