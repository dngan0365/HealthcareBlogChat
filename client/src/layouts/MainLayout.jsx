import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
<div className="mainContainer" style={{
    backgroundColor: '#E8F5E9',
    position: 'relative', // Make sure the parent has relative positioning
    minHeight: '100vh', // Ensure the parent has enough height for sticky to work
  }}>
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>
    <div className="">
      <Outlet />
    </div>
</div>
  );
};

export default MainLayout;