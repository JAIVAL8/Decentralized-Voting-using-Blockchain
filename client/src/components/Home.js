import React from 'react'

function Home() {
    const postData = () => {
   const v=JSON.parse( localStorage.getItem("user"));
  
  
  const { uId,  gender, age,city} = JSON.parse( localStorage.getItem("user"));
   const  receiver = "raju";
        console.log(uId);
   fetch('http://localhost:4001/transaction/broadcast', {
    mode: 'no-cors',
   method: "post",
   
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
    uId,receiver,city,age,gender
     
    },console.log(uId,gender,age,receiver)),
    
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      } 
        ).catch((err)=>{console.log(err)});
 
    }
    return (
        <div>
           <button onClick={()=>postData()} >test1</button>
        </div>
    )
}

export default Home
