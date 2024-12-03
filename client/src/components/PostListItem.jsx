import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  if (!post) return <div>Không có bài post nào</div>; // Ensure `post` exists

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* Image Section */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image src={post.img} className="rounded-2xl object-cover" w="735" h="500"/>
        </div>
      )}

      {/* Details Section */}
      <div className="flex flex-col xl:w-2/3 justify-between">
        <div className="flex flex-col gap-4 h-full">
          {/* Title */}
          <Link to={`/${post.slug || "#"}`} className="text-4xl font-semibold line-clamp-2">
            {post.title || "Untitled Post"}
          </Link>
          
          {/* Post Info */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link className="text-[#4CAF4F]" to={`/posts?author=${post.user?.username || "unknown"}`}>
              {post.user?.username || "Anonymous"}
            </Link>
            <span>on</span>
            <Link className="text-[#4CAF4F]">
              {post.category || "Uncategorized"}
            </Link>
            <span>{post.createdAt ? format(post.createdAt) : "Unknown date"}</span>
          </div>

          {/* Description */}
          <p className="line-clamp-3">{post.desc || "No description available."}</p>

          {/* Read More Button */}
          <div className="mt-auto">
            <Link to={`/${post.slug || "#"}`} className="underline text-sm">
              <button
                className="py-2 px-5 rounded-3xl text-white hover:opacity-90"
                style={{ backgroundColor: '#4CAF4F' }}
              >
                Read more
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
