"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiChat } from "react-icons/bi";
import { BsChatRightDotsFill, BsMenuButtonFill } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import ReactTextareaAutosize from "react-textarea-autosize";
import { getChatResponse } from "../api/fetchData";
import { InfinitySpin } from "react-loader-spinner";
import markdownToHtml from "../api/textFormatter";
import { MdMenuOpen } from "react-icons/md";

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
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [content , setContent] = useState<string>('');

  const convertMarkdown = async (markdown:any) => {
    const htmlContent = await markdownToHtml(markdown);
    return htmlContent;
  };

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const submitHandler = async (e : any) => {
    try {
      e.preventDefault();
      setData((prev: any) => {
        const updatedArray = [...prev , {
          question:search,
          answer:'',
        }]
        return updatedArray;
      });
      setDebounce(true);
      getChatResponse(search).then(async (res: any) => { 
        console.log(res , '$$');
        const html = await convertMarkdown(res?.chatMessage?.answer);
        setData((prev: any) => {
            const updatedArray = [...prev];
            updatedArray[updatedArray.length-1].answer = html;
            return updatedArray;
        });
        setDebounce(false);
      }).catch((error) => { 
        setDebounce(false);
        console.log(error);
        setData((prev: any) => {
          const updatedArray = [...prev];
          updatedArray[updatedArray.length - 1].answer = (error.message || 'Error while fetching response :(');
          return updatedArray;
        });
      });
      setSearch("");
    } catch (err:any) {
      console.log(err);
      setData((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[updatedArray.length - 1].answer = (err.message || 'Error while fetching response :(');
        return updatedArray;
      });
    }
  };

  return (
    <div
      className={`sticky top-0 h-[100vh]  bg-zinc-800 ${
        chatOpened ? "w-[25vw]" : "w-[0vw]"
      } transition-width duration-500 overflow-hidden`}
    >
      <div className="flex flex-row">
      <button
        className="absolute top-2 left-2 flex flex-row items-center gap-3"
        onClick={() => setChatOpened(!chatOpened)}
        title={chatOpened ? "Close chat" : "Open chat"}
      >
        <MdMenuOpen size={20} className="text-gray-300" />
        <div className="text-base text-white font-sans flex flex-row gap-2">
        <img className="w-5 h-5" src="/image.png"/>     
        <p className="text-base text-zinc-300 font-semibold">   Harvest.AI
</p>
      </div>
      </button>
     
      </div>
      <BsChatRightDotsFill
        onClick={() => setData([])}
        size={25}
        className={`text-gray-300 absolute top-2 right-2 cursor-pointer ${
          !chatOpened && "opacity-0"
        } transition-opacity duration-300`}
        title="Create new chat"
      />
      {/* <div className="border-2 border-white"></div> */}

      <div className="flex flex-col gap-3 mt-10  border-t border-slate-950">
        {chatOpened && (
          <div className=" h-[80vh] overflow-y-auto text-white">
            <div className="">
              {data.map((data: any, index: number) => {
                return (
                  <div key={index}>
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
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: data.answer }} />
                    </div>
                  </div>
                );
              })}
              {
                debounce && <div className=" flex flex-col justify-center items-center -ml-7 bg-slate-700">  <InfinitySpin
                visible={true}
                width="100"
                color="#aaffdd"
                ariaLabel="infinity-spin-loading"
              />
              </div>
              }
            </div>
          </div>
        )}

        <form onSubmit={(e) => {if(!debounce)submitHandler(e)}}>
          {chatOpened && (
            <div className="flex justify-between items-end px-1 w-[95%]">
              <ReactTextareaAutosize
                ref={ref}
                className="border mx-2 rounded-lg px-3  py-2  bg-transparent w-[97%] resize-none text-white text-sm"
                placeholder="Ask your question here ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                maxRows={1}
                minRows={1}
                rows={1}
              />
              <button
                type="submit"
                className="my-auto rounded-lg bg-white text-black p-2.5 ml-2"
              >
                <FaArrowUp />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Sidenav;
