import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
    <div className="px-6 md:px-8 lg:px-16 lx:px-32 2xl:px-64 w-full h-12 md:h-16 flex items-center justify-between "
    style={{ backgroundColor: '#C8E6C9' }}>
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="BlogChatbot/logo.svg" alt="Lama Logo" w={32} h={32} />
        <span className="text-[#415042]">MedComp</span>
      </Link>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {/* Change Hamburger Icon */}
          {/* {open ? "X" : "☰"} */}
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>
        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#C8E6C9] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={()=>setOpen(false)} className="text-[#415042]">Home</Link>
          <Link to="/posts?sort=trending" onClick={()=>setOpen(false)} className="text-[#415042]">Most Popular</Link>
          <Link to="/write" onClick={()=>setOpen(false)} className="text-[#415042]">Write</Link>
          <Link to="/dashboard" onClick={()=>setOpen(false)} className="text-[#415042]">Chat</Link>
          <Link to="/" onClick={()=>setOpen(false)} className="text-[#415042]">Schedule</Link>
          <SignedOut>
            <Link to="/login" onClick={()=>setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl text-white"
              style= {{backgroundColor: '#4CAF4F'}}>
                Login 👋
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium text-[#415042]">
        <Link to="/">Home</Link>
        <Link to="/posts?sort=popular">Most Popular</Link>
        <Link to="/write">Write</Link>
        <Link to="/dashboard">Chat</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl  text-white"
            style= {{backgroundColor: '#4CAF4F'}}>
              Login 👋
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      </div>

    </div>
  );
};

export default Navbar;