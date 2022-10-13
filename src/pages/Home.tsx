import React from 'react';

import Logo from "../assets/bitcoin-button.png";

function Home() {
    return (
        <>
        <div className="flex place-content-center w-full mt-60">
        <a href='/Index'>
        <img
          src={Logo}
          alt="Bitcoin Button"
          className="w-52 place-content-center"
        /> </a>
        
        <h1>click the bitcoin </h1>
        
      </div>

        </>
    )
}

export default Home;