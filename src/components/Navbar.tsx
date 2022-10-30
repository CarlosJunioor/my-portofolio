import React from "react";

function Navbar() {
  return (
    <>
      <nav>
        <ul class="flex items-center justify-center font-semibold text-white">
          <li class="relative group px-3 py-2">
            <button class="transition ease-in-out delay-15 hover:-translate-y-1 hover:scale-110 hover:bg-sky-500 duration-300 rounded-full px-3 py-2 font-semibold bg-white bg-opacity-20 flex items-center group">
              Home
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>
          <li class="relative group px-3 py-2">
            <button class="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
              About
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>
          <li class="relative group px-3 py-2">
            <button class="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
              Experience
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>
          <li class="relative group px-3 py-2">
            <button class="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
              Projects
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>
          <li class="relative group px-3 py-2">
            <button class="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
              Blog
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>

          <li class="relative group px-3 py-2">
            <button class="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
              Contact
            </button>
            <div class="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform"></div>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
