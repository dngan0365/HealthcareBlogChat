import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Homepage = () => {
  return (
    <div>
          {/* hero */}
        <section className="relative bg-cover bg-center h-[66vh]" style={{ backgroundImage: 'url("cover.jpg")' }}>
            <div className="absolute inset-0 "></div>
            <div className="relative container mx-auto px-6 py-20 ">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#7FBA81]">Healthier today</h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#415042]">Happier tomorrow</h2>
            <p className="text-lg mb-8 text-gray-600">A place to higher your life quality and feel your mind</p>
            </div>
        </section>
    
    <div className=' px-4 md:px-6 lg:px-16 xl:px-30 2xl:px-62 mr-16 ml-16 flex flex-col gap-2'>
        {/* INTRODUCTION */}
        <div className="items-center justify-between">
            {/* titles */}
            <div className="my-8 text-center">
                <h1 className="text-[#415042] text-2xl md:text-5xl lg:text-6xl font-bold">Blogs for you</h1>
                <p className="mt-8 text-md md:text-xl text-gray-400">Get motivated and stay healthy with our community</p>
            </div>
        </div>
        {/* CATEGORIES */}
        <MainCategories/>
        {/* FEATURED POSTS */}
        <FeaturedPosts/>
        {/* POST LIST */}
        <div className="">
            <h1 className="my-8 text-2xl text-gray-600">Rescent Posts</h1>
            <PostList/>
        </div>
    </div >
    <div className="fixed bottom-2 right-2 md:bottom-2 md:right-2 lg:bottom-2 lg:right-2 text-white px-2 py-1 md:px-6 md:py-3 text-sm md:text-base lg:text-lg">
        {/* animated button */}
        <Link to="/dashboard" className="hidden md:block relative">
                <svg    
                    viewBox="0 0 200 200"
                    width="140"
                    height="140"
                    className="text-lg tracking-widest animate-spin animatedButton text-gray-400"
                >
                    <path
                        id = "circlePath"
                        fill="none"
                        d = "M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                    <text  className="fill-current">
                        <textPath href="#circlePath" startOffset="0%">
                            Medical Companion
                        </textPath>
                        <textPath href="#circlePath" startOffset="50%">
                            Health Conversation
                        </textPath>
                    </text>
                </svg>
                <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20  flex items-center justify-center">
                    {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="50"
                    height="50"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-1.5 4.78 8.5 8.5 0 0 1-7.5 3.72A8.38 8.38 0 0 1 4 16.28L2 20l3.72-1.5a8.38 8.38 0 0 0 4.78 1.5 8.5 8.5 0 0 0 8.5-8.5z" />
                        <line x1="8" y1="10" x2="8" y2="10" />
                        <line x1="12" y1="10" x2="12" y2="10" />
                        <line x1="16" y1="10" x2="16" y2="10" />
                    </svg> */}
                    <svg 
                    xmlns="http://www.w3.org/2000/svg"     
                    viewBox="0 0 512 512"
                    width="60" 
                    height="60" 
                    style={{ color: '#4CAF4F' }} // Optional, for stroke-based elements
                    >
                    <path 
                        d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM224 160c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 48 48 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l48 0 0-48z"
                        fill="#4CAF4F"
                    />
                    </svg>
                </button>
            </Link>
    </div>
    </div>
  );
};

export default Homepage;