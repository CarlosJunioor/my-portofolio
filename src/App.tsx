import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from './pages/Home.tsx';
import Index from './pages/Index/Index.tsx';
import About from './pages/About/About.tsx';
import Contact from './pages/Contact/Contact.tsx';
import Projects from './pages/Projects/Projects.tsx';
import Socials from './pages/Socials/Socials.tsx';


function App() {
  return (
    <>
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/Index" element={<Index />} />
			<Route path="/About" element={<About />} />
			<Route path="/Contact" element={<Contact />} />
			<Route path="/Projects" element={<Projects />} />
			<Route path="/Socials" element={<Socials />} />
		</Routes>
	</BrowserRouter>

    </>
  );
}

export default App;
