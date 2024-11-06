'use client'
import { useEffect, useState } from "react";

export default function Home() {
  
  const [data, setData] = useState<any[]>([]);
  
  useEffect(()=>{

    const fetchData = async()=>{
      const res = await fetch('https://script.google.com/macros/s/AKfycbwEXFMUruzutqeOQDwfM1sJen7uAm3VTE6iYSedruZOjGLPlq6lAOggl4s1HBCEIvvt/exec');
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
