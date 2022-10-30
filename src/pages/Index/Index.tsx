import React from "react";

function Index() {

  
  return (
    <>
    
      <img
        className="h-96 mx-auto"
        src="https://img.seadn.io/files/45995c3ab8a703c96611ccecb5444324.png?fit=max&w=1000"/>
      <div className="grid justify-center">
      <h1 className="text-4xl">
        Frontend developer doing a career shift from sales
      </h1>

      <ul>
        <a href="/Socials">
          <li>socials</li>
        </a>
        <a href="/Projects">
          <li>projects</li>
        </a>
        <a href="https://dev.to/carlosjuniordev">
          <li>my articles</li>
        </a>
        <a href="/About">
          <li>about me</li>
        </a>
        <a href="/Contact">
          <li>contact</li>
        </a>
      </ul>
      </div>
    </>
  );
}

export default Index;
