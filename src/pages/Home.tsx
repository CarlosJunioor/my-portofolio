import React from 'react';
import Navbar from '../components/Navbar.tsx';

import Logo from "../assets/background.png";
import Logo2 from "../assets/background-removebg.png";

function Home() {

  
    return (
        <>
		<body className="bg-[#16131E]">
		<Navbar />

     <div className="flex place-content-center w-full mt-5">
        <a href='/Index'>
        <img
          className="rounded-xl"
          src={Logo}
          alt="Astrounaut Flying into Space"
        />
        
        <img className="absolute top-20 animate-pulse"
          src={Logo2}
          alt="Astrounaut Flying into Space"
        /> 
        
        <h1 className="text-6xl absolute text-white top-80">
        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-300">Carlos Junior</span>
      </h1>
      <br></br>
      <h1 className="text-5xl absolute text-white top-96">
        I am a Front End Developer from <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-red-600">Portugal</span>
      </h1>
      
        </a>
      </div>

</body>
        </>
    )
}

export default Home;