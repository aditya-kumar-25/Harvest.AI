"use client";

import { locationState, StateName } from "@/state/location";
import React, { use, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { ImLocation } from "react-icons/im";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";


function SoilQualityCheck (){
  const [location, setLocation] = useRecoilState(locationState);
    const [stateName, setStateName] = useRecoilState(StateName);
  const [clicked, setClicked] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (location.lat !== 0 && location.lng !== 0) {
        setIsLoading(true);

    if (!stateName) return; 
// Create Chat Session
// Step 1: Create Chat Session
fetch('https://gateway-dev.on-demand.io/chat/v1/sessions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt'
    },
    body: JSON.stringify({
        "pluginIds": [],
        "externalUserId": "1"
    })
})
.then(response => response.json())
.then(data => {
    const sessionId = data.chatSession.id; // Extracting session ID
    // Step 2: Answer Query using the sessionId
    fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt'
        },
        body: JSON.stringify({
            "endpointId": "predefined-openai-gpt4o",
            "query": `soil quality of ${location.lat}N and ${location.lng}E in ${stateName}`,
            "pluginIds": ["plugin-1717418212"],
            "responseMode": "sync"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response data here
        setQuery(data);
        setIsLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
    });
})
.catch(error => {
    console.error('Error:', error);
});
  }}, [stateName]);


  const answer = query.chatMessage?.answer;

  const phrasesToRemove = [
    "The provided context does not contain specific information about the soil quality of ${stateName} ? However, based on general knowledge, ",
    "The context provided does not contain specific information about the soil quality of ${stateName}? However, based on general knowledge,"
  ];
  
  let cleanedAnswer = answer;
  
  if (cleanedAnswer) {
    phrasesToRemove.forEach(phrase => {
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

      <img src="/images.jpg" className="w-full h-full blur-[2px] image rounded-xl  " />

        <div className="absolute z-10 top-[35%] left-5 flex items-center gap-4">
          <ImLocation size={40} color="white"/>
          {stateName && <p className="font-semibold text-xl font-sans">{(stateName ? stateName : 'Loading...')}<span className="text-sm font-[400] ml-4">{'(read more about its soil)'}</span></p>}
        </div>

      <div
        className={`${
          !clicked && "translate-x-[100%]"
        } transition-transform duration-300 absolute z-20 bg-image-soil top-0 h-full w-full overflow-hidden`}
      >
       <div className="px-3 py-1 mr-10 text-white-500 ">{isLoading ? (
  <div className="text-white">
    <div className="text-white rounded-2xl justify-center items-center flex flex-col">
      <InfinitySpin
        visible={true}
        width="200"
        color="#aaffdd"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  </div>
) : query === undefined || query.chatMessage === undefined ? (
  <div className="text-white">
    <div className="text-white rounded-2xl justify-center items-center flex flex-col">
      <InfinitySpin
        visible={true}
        width="200"
        color="#aaffdd"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  </div>
) : (
  <p className="text-sm font-sans text-justify text-zinc-200 font-light p-2">
    {cleanedAnswer}
  </p>
)}</div>
      </div>
    </div>
  );
};

export default SoilQualityCheck;

