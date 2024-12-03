import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 md:px-6 lg:px-16 xl:px-30 2xl:px-62 mt-5">
      <h3 className="mb-8 text-2xl">Let cover a variety of health topics and perspectives on medical news.</h3>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-[#4CAF4F] text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse gap-1 md:flex-row justify-between">
        <div className="w-full md:w-3/4">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block w-full md:w-1/4`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;