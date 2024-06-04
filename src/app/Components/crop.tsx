import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react"
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";

export function Crop(){
const [stateName, setStateName] = useRecoilState(StateName);
const [location, setLocation] = useRecoilState(locationState);
const [query, setQuery] = useState<string>('');
    useEffect(() => {
        if (!stateName) return; // If stateName is null, exit 

fetch('https://gateway-dev.on-demand.io/chat/v1/sessions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt'
    },
    body: JSON.stringify({ "pluginIds": [], "externalUserId": "1" })
})
.then(response => response.json())
.then(data => {
    const sessionId = data.chatSession.id;
    
    // Answer Query API
    fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt'
        },
        body: JSON.stringify({ "endpointId": "predefined-openai-gpt4o", "query": `Give me the crop suggesstions for ${stateName}`, "pluginIds": ["plugin-1717467138"], "responseMode": "sync" })
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data here
        console.log(data);
        setQuery(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
})
.catch(error => {
    console.error('Error:', error);
});


    },[stateName]);


    return (
        <div className="w-full h-full overflow-y-scroll">
{query === undefined || query.chatMessage === undefined ? (
    <div className="text-white"><div className="text-white w-full h-[25.5vh]  glass rounded-2xl justify-center items-center flex flex-col">  <InfinitySpin
    visible={true}
    width="200"
    color="#aaffdd"
    ariaLabel="infinity-spin-loading"
    />
    </div></div>
  ) : (
    <p className="text-sm  font-sans text-justify text-zinc-200 font-light px-2 overflow-hidden  ">
      {JSON.stringify(query.chatMessage.answer)}
    </p>
  )}     
 </div>
    )
}