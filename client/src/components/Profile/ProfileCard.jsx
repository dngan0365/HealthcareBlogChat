

export default function ProfileCard(props) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
        {/* Card Header */}
        <div className="flex flex-col items-center py-6 text-center">
          {/* Profile Photo */}
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full border-4 border-white"
              src="./avatar.webp"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 bg-[#4CAF4F] text-white p-2 rounded-full border-2 border-white">
             
            </div>
          </div>
  
          {/* Name and Subtitle */}
          <h2 className="text-lg font-semibold mt-4">{props.name}</h2>
          <p className="text-gray-500">{props.sub}</p>
        </div>
  
        {/* Details Section */}
        <div className="grid grid-cols-3 border-t border-gray-200 divide-x">
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-600">Username</p>
            <p className="text-sm font-medium text-gray-600">Email</p>
          </div>
          <div className="px-4 py-2 text-right flex-1">
            <p className="text-sm text-gray-500">{props.dt1}</p>
            <p className="text-sm text-gray-500">{props.dt2}</p>
          </div>
        </div>
  

      </div>
    );
  }
  