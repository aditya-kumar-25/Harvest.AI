import { locationState, StateName } from "@/state/location";
import axios from "axios";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";

interface ChatQuery {
  answer?: string;
}

export function Heat() {
  const [stateName, setStateName] = useRecoilState(StateName);
  const [location, setLocation] = useRecoilState(locationState);
  const [query, setQuery] = useState<ChatQuery>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!stateName) return; // If stateName is null, exit the useEffect hook
      setIsLoading(true); // Set isLoading to true when stateName changes

      // Create Chat Session
      let data = JSON.stringify({
        "pluginIds": [
          "plugin-1717443567",
          "plugin-1717400660"
,          "plugin-1713962163"
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

      let sessionId = '';
      await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        sessionId = response.data.chatSession.id;
      })
      .catch((error) => {
        console.log(error);
      });

      // Use the session ID for the second API call
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
            query: `Hi, Can you please tell me the water quality of ${stateName}`,
            pluginIds: [ "plugin-1717443567",
              "plugin-1717400660"
    ,          "plugin-1713962163"],
            responseMode: "sync",
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle response from second API call
          console.log(data);
          setQuery(data.data); // Update to use the 'data' field from the response
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setIsLoading(false); // Set isLoading to false after the data is fetched
    };

    fetchData().catch((error: any) => console.error("Error:", error));
  }, [stateName]);

  return (
    <div className="w-full h-full overflow-y-auto">
      {isLoading || !query.answer ? (
        <div className="text-white">
          <div className="text-white w-full h-[25.5vh] glass rounded-2xl justify-center items-center flex flex-col">
            <InfinitySpin width="200" color="#aaffdd" />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="pl-2 pb-2 border-b border-zinc-500 text-white">
            Water Quality
          </h2>
          <p className="text-sm font-sans text-justify text-zinc-200 font-light px-2 overflow-hidden pt-2">
            {query.answer}
          </p>
        </div>
      )}
    </div>
  );
}