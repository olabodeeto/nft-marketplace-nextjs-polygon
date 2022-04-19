import React, { useState } from "react";
import wall from "../assets/wall.svg";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [navbarOpen, setnavbarOpen] = useState(false);

  return (
    <>
      <header className="fixed z-50 top-0 w-full flex justify-between items-center bg-white shadow-lg px-4  m-auto  h-24 bg-primary md:px-28 overflow-scroll">
        <div className="">
          <h1 className="text-2xl font-extrabold">
            <Link href="/">ENFT</Link>
          </h1>
        </div>

        <nav>
          <button
            className="md:hidden"
            onClick={() => setnavbarOpen(!navbarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-9 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            onClick={() => setnavbarOpen(!navbarOpen)}
            className={`fixed left-0 top-24 md:top-0 bg-gray-900 md:bg-transparent right-0 min-h-screen overflow-scroll bg-primary text-white font-light pt-10 text-4xl md:text-base space-y-8 p-4 transition duration-200 transform ${
              navbarOpen ? "translate-x-0" : "translate-x-full"
            } md:relative md:flex md:min-h-0 md:space-y-0 md:space-x-6 md:p-0 md:translate-x-0 md:text-slate-800`}
          >
            <div className="md:flex flex-row gap-5 md:w-full">
              <div className="flex flex-col md:flex gap-5 md:flex-row md:gap-10 md:mt-4 text-black">
                <li>
                  <Link href="/">Home</Link>
                </li>

                <li>
                  <Link href="/create-nft">Mint NFT</Link>
                </li>

                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>

                <li>Support</li>
              </div>
              <div className="md:ml-80 md:flex md:flex-row">
                {/* <div className=" md:py-3 md:px-10 mt-4 md:mt-0">Login</div> */}
                <div className="bg-blue-600 md:bg-slate-800 md:ml-10 px-2 mt-4 md:mt-0 text-white py-3 md:px-10 flex justify-center gap-4 rounded-xl">
                  <div className="w-12 lg:w-4">
                    <Image src={wall} className="w-auto" />
                  </div>
                  <span>Connect wallet</span>
                </div>
              </div>
            </div>
          </ul>
        </nav>
      </header>
    </>
  );
}
