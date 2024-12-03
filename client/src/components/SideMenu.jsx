import { Link, useSearchParams } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };
  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat:category,
      });
    }
  };


  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#4CAF4F] cursor-pointer rounded-sm bg-white checked:bg-[#4CAF4F]"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#4CAF4F] cursor-pointer rounded-sm bg-white checked:bg-[#4CAF4F]"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#4CAF4F] cursor-pointer rounded-sm bg-white checked:bg-[#4CAF4F]"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#4CAF4F] cursor-pointer rounded-sm bg-white checked:bg-[#4CAF4F]"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("general")}>All</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("nutrition")}>Nutrition</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("lifestyle")}>LifeStyle</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("pain")}>Pain</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("cancer")}>Cancer</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("mind-mood")}>Mind & Mood</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("disease-conditions")}>Disease & Conditions</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("adult-health")}>Adult Health</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("child-teen-health")}>Child & Teen Health</span>
      </div>
    </div>
  );
};

export default SideMenu;