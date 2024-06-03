"use client";

import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { ImLocation } from "react-icons/im";

type ContentProps = {
  stateName: string | null;
};

const SoilQualityCheck: React.FC<ContentProps> = ({ stateName }) => {
  console.log(stateName, " <-- ");

  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div className="relative h-full overflow-hidden">
      <button
        onClick={() => setClicked(!clicked)}
        className={`absolute top-[40%] right-4 z-[21] ${
          clicked && "rotate-180"
        } transition duration-300`}
      >
        <div className="p-1 rounded-full bg-white">
          <FaChevronLeft size={30} className="text-black" />
        </div>
      </button>

      <img src="/images.jpg" className="w-full h-full blur-[2px] image rounded-xl  " />

        <div className="absolute z-10 top-[40%] left-5 flex items-center gap-4">
          <ImLocation size={50}/>
          {stateName && <p className="font-semibold text-xl font-sans">{(stateName ? stateName : 'Loading...')}<span className="text-sm font-[350] ml-4">{'(read more about soil quality)'}</span></p>}
        </div>

      <div
        className={`${
          !clicked && "translate-x-[100%]"
        } transition-transform duration-300 absolute z-20 bg-image-soil top-0 h-full w-full overflow-hidden`}
      >
        <p className="px-3 py-1 mr-10 text-white-500 ">{"Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ad numquam. Odio esse dolore facilis, similique voluptate nulla consequatur aliquam sint harum tempore perferendis tenetur, reprehenderit consequuntur voluptates! Doloremque, velit dolore quod quidem illum rerum veritatis amet totam saepe provident officia id aut. Neque illum distinctio molestias voluptate esse deserunt."}</p> 
      </div>
    </div>
  );
};

export default SoilQualityCheck;
