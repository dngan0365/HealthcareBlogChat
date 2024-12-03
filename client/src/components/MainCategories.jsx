import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className='hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8'>
        {/* links */}
        <div className="basis-full md:basis-4/6 flex items-center justify-between flex-wrap">
            <Link
            to="/posts"
            className=" text-white rounded-full px-4 py-2"
            style= {{backgroundColor: '#4CAF4F'}}
            >
                All Posts
            </Link>

            <Link
                to="/posts?cat=nutrition"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Nutrition
            </Link>
            <Link
                to="/posts?cat=lifestyle"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                LifeStyle
            </Link>
            <Link
                to="/posts?cat=pain"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Pain
            </Link>
            <Link
                to="/posts?cat=cancer"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Cancer
            </Link>
            <Link
                to="/posts?cat=mind-mood"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Mind & Mood
            </Link>
            <Link
                to="/posts?cat=disease-conditions"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Disease & Conditions
            </Link>
            <Link
                to="/posts?cat=adult-health"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Adult Health
            </Link>
            <Link
                to="/posts?cat=child-teen-health"
                className="hover:bg-[#E8F5E9] rounded-full px-4 py-2"
                >
                Child & Teen Health
            </Link>
            

      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search/>
    </div>
  );
};

export default MainCategories;