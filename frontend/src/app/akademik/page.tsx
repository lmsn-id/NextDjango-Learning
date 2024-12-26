"use client";
import LogoutButton from "@/Components/LogoutButton";
import { useState, useEffect } from "react";

export default function Akademik() {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenSidebar(false);
      } else {
        setOpenSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside className="md:w-1/5 h-screen bg-red-700 flex justify-center">
        <h1 className="text-2xl font-bold text-white">Akademik</h1>
        <LogoutButton className="text-white" />
      </aside>
      <nav className="w-full bg-blue-800 h-20">
        <button onClick={() => setOpenSidebar(!openSidebar)}>Open</button>
      </nav>
    </>
  );
}
