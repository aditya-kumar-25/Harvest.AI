"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiChat } from "react-icons/bi";
import { BsMenuButtonFill } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import ReactTextareaAutosize from "react-textarea-autosize";

type SidenavProps = {
  chatOpened: Boolean;
  setChatOpened: any;
};

const sampleData = [
  {
    question: "What are the major crops grown in UAE?",
    answer:
      "The major crops grown in UAE include dates, tomatoes, cucumbers, eggplants, and lettuce.",
  },
  {
    question: "What are the common farming practices in UAE?",
    answer:
      "Common farming practices in UAE include hydroponics, vertical farming, and greenhouse cultivation.",
  },
  {
    question: "How does the UAE ensure water availability for agriculture?",
    answer:
      "The UAE utilizes advanced irrigation techniques such as drip irrigation and desalination of seawater to ensure water availability for agriculture.",
  },
  {
    question: "What are the challenges faced by agriculture in UAE?",
    answer:
      "Challenges faced by agriculture in UAE include limited arable land, high temperatures, and water scarcity.",
  },
];

const Sidenav: React.FC<SidenavProps> = ({ chatOpened, setChatOpened }) => {
  const [debounce, setDebounce] = useState<Boolean>(false);

  const ref = useRef<HTMLTextAreaElement | null>(null);


  const [search, setSearch] = useState<string>("");

  return (
    <div
      className={`relative h-[100vh]  bg-zinc-800 ${
        chatOpened ? "w-[25vw]" : "w-[0vw]"
      } transition-width duration-500 overflow-hidden`}
    >
      <button
        className="absolute top-2 left-2"
        onClick={() => setChatOpened(!chatOpened)}
        title={chatOpened ? "Close chat" : "Open chat"}
      >
        <BsMenuButtonFill size={20} className="text-gray-300" />
      </button>
      <BiChat
        size={25}
        className={`text-gray-300 absolute top-2 right-2 cursor-pointer ${
          !chatOpened && "opacity-0"
        } transition-opacity duration-300`}
        title="Create new chat"
      />
      {/* <div className="border-2 border-white"></div> */}

      <div className="flex flex-col gap-3 mt-10">
        {chatOpened && (
          <div className=" max-h-[80vh] overflow-y-auto">
            <div className="">
              {sampleData.map((data: any, index: number) => {
                return (
                  <div>
                    <div className="flex justify-between items-center p-4 border-b border-gray-700 cursor-pointer">
                      <div>
                        <p className="text-white font-semibold">
                          {data.question}
                        </p>
                      </div>
                      <div className="text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-b border-gray-700 ${
                        debounce && index === 0 && "bg-gray-700"
                      }`}
                    >
                      <p className="text-gray-300">{data.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chatOpened && (
          <div className="flex justify-between items-end px-1">
            <ReactTextareaAutosize
            ref={ref}
              className="border mx-2 rounded-lg px-3  py-2  bg-transparent w-[97%] resize-none"
              placeholder="Type your query here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxRows={1}
              minRows={1}
              rows={1}
            />
            <div className="my-auto rounded-full bg-white text-black p-1">
              <FaArrowUp />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidenav;
