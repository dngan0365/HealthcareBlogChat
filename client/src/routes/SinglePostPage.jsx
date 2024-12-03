import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {format} from "timeago.js"
import axios from "axios";
import Image from "../components/Image";
import Search from "../components/Search";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";


const fetchPost = async (slug) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    return res.data;
  };

const SinglePostPage = () => {

    const { slug } = useParams();

    const { isPending, error, data } = useQuery({
      queryKey: ["post", slug],
      queryFn: () => fetchPost(slug),
    });
  
    if (isPending) return "loading...";
    if (error) return "Something went wrong!" + error.message;
    if (!data) return "Post not found!";
  
    return (
      <div className="px-4 md:px-6 lg:px-16 xl:px-30 2xl:px-62 flex flex-col gap-8 mt-10">
        {/* detail */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          <div className="lg:w-3/5 flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-gray-800">
              {data.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Written by</span>
              <Link className="text-[#4CAF4F] font-medium hover:underline">
                {data.user.username}
              </Link>
              <span className="hidden md:inline-block">|</span>
              <span>on</span>
              <Link className="text-[#4CAF4F] font-medium hover:underline">
                {data.category}
              </Link>
              <span className="hidden md:inline-block">|</span>
              <span>{format(data.createdAt)}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {data.desc}
            </p>
          </div>

          {/* Image */}
          {data.img && (
            <div className="w-full lg:w-2/5 flex-shrink-0 hidden lg:block">
              <Image
                src={data.img}
                alt={data.title}
                w="600"
                h="500"
                className="rounded-2xl shadow-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          {/* text */}
          <div
            className="w-full max-w-4xl md:w-2/3 lg:text-lg flex flex-col gap-5 text-justify"
            dangerouslySetInnerHTML={{ __html: data.content.replace(
              /<img /g,
              '<img class="block mx-auto max-w-full max-h-[500px] w-auto h-auto rounded-md shadow-lg"'
            ) }}
          ></div>


          {/* menu */}
          <div className="px-4 h-max sticky top-20 self-start"
              style={{
                maxWidth: "300px", // Optional: limit menu width
              }}>
            <h1 className="mb-4 text-sm font-medium">Author</h1>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-8">
                {data.user.img && (
                  <Image
                    src={data.user.img}
                    className="w-12 h-12 rounded-full object-cover"
                    w="48"
                    h="48"
                  />
                )}
                <Link className="text-[#4CAF4F]">{data.user.username}</Link>
              </div>
              <div className="flex gap-2">
                <Link>
                  <Image src="BlogChatbot/facebook.svg" />
                </Link>
                <Link>
                  <Image src="BlogChatbot/instagram.svg" />
                </Link>
              </div>
            </div>
            <PostMenuActions post={data}/>
            <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="underline">All</Link>
              <Link className="underline" to="/">
                Nutrition
              </Link>
              <Link className="underline" to="/">
                LifeStyle
              </Link>
              <Link className="underline" to="/">
                Pain
              </Link>
              <Link className="underline" to="/">
                Cancer
              </Link>
              <Link className="underline" to="/">
                Mind & Mood
              </Link>
              <Link className="underline" to="/">
                Disease & Conditions
              </Link>
              <Link className="underline" to="/">
                Adult Health
              </Link>
              <Link className="underline" to="/">
                Child & Teen Health
              </Link>
            </div>
            <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
            <Search />
          </div>
        </div>
        <Comments postId={data._id}/>
      </div>
    );

};

export default SinglePostPage;