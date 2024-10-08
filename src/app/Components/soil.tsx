"use client";

import { locationState, StateName } from "@/state/location";
import axios from "axios";
import { error } from "console";
import React, { use, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { ImLocation } from "react-icons/im";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";


interface ChatQuery {
    answer?: string;
}

function SoilQualityCheck() {
  const [location, setLocation] = useRecoilState(locationState);
  const [stateName, setStateName] = useRecoilState(StateName);
  const [clicked, setClicked] = useState<boolean>(false);
  const [query, setQuery] = useState<ChatQuery>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
    if (location.lat !== 0 && location.lng !== 0) {
      setIsLoading(true);

      if (!stateName) return;
      // Create Chat Session
      // Step 1: Create Chat Session
      let data = JSON.stringify({
        "pluginIds": [
          "plugin-1717418212","plugin-1713962163"
        ],
        "externalUserId": "1"
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.on-demand.io/chat/v1/sessions',
        headers: { 
          'apikey': 'SyuuzaftNhzKZoZNFZz33xxMZblRer4p', 
          'Content-Type': 'application/json'
        },
        data : data
      };

      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        const sessionId = response.data.chatSession.id;

      // Step 2: Answer Query using the sessionId
      fetch(
        `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "SyuuzaftNhzKZoZNFZz33xxMZblRer4p",
          },
          body: JSON.stringify({
            endpointId: "predefined-openai-gpt4o",
            query: `soil quality of ${location.lat}N and ${location.lng}E in ${stateName}`,
            pluginIds: ["plugin-1717418212", "plugin-1713962163"],
            responseMode: "sync",
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Handle the response data here
          setQuery(data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
};

fetchData();
}, [location, stateName]);

  const answer = query?.answer;

  const phrasesToRemove = [
    "The provided context does not contain specific information about the soil quality of ${stateName} ? However, based on general knowledge, ",
    "The context provided does not contain specific information about the soil quality of ${stateName}? However, based on general knowledge,",
  ];

  let cleanedAnswer = answer ?? "";

  if (cleanedAnswer) {
    phrasesToRemove.forEach((phrase) => {
      cleanedAnswer = cleanedAnswer.replace(phrase, "");
    });
  }

  return (
    <div className="relative h-full overflow-hidden border-zinc-500 border rounded-xl">
      <button
        onClick={() => setClicked(!clicked)}
        className={`absolute top-[40%] right-4 z-[21] ${
          clicked && "rotate-180"
        } transition duration-300`}
      >
        <div className="p-1 rounded-full bg-white">
          <FaChevronLeft size={25} className="text-black" />
        </div>
      </button>

      <img
        src="/images.jpg"
        className="w-full h-full blur-[2px] image rounded-xl  "
      />

      <div className="absolute z-10 top-[30%]  left-10 flex items-center gap-4">
        <ImLocation size={40} color="white" />
        {stateName && (
          <p className="font-semibold text-xl font-sans">
            {stateName ? stateName : "Loading..."}
            <br />
            <span className="text-sm font-[400]">
              {"(read more about its soil)"}
            </span>
          </p>
        )}
      </div>

      <div
        className={`${
          !clicked && "translate-x-[100%]"
        } transition-transform duration-300 absolute z-20 bg-image-soil top-0 h-full w-full overflow-hidden`}
      >
        <div className="px-3 py-1 mr-10 text-white-500 overflow-y-scroll h-full">
          {isLoading ? (
            <div className="text-white">
              <div className="text-white rounded-2xl justify-center items-center flex flex-col">
                <InfinitySpin
                  width="200"
                  color="#aaffdd"
                />
              </div>
            </div>
          ) : query === undefined || query.answer ? (
            <div className="text-white">
              <div className="text-white rounded-2xl justify-center items-center flex flex-col">
                <InfinitySpin
                  width="200"
                  color="#aaffdd"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className=" pl-2 py-2 border-b border-zinc-500 text-white">
                Soil Quality
              </h2>
              <div className="text-sm font-sans text-justify text-zinc-200 font-light div-2">
                {cleanedAnswer}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SoilQualityCheck;
