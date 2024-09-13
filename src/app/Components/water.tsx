import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";

interface ChatQuery {
  chatMessage?: {
    answer?: string;
  };
}
export function Heat() {
  const [stateName, setStateName] = useRecoilState(StateName);
  const [location, setLocation] = useRecoilState(locationState);
  const [query, setQuery] = useState<ChatQuery>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stateName) return; // If stateName is null, exit the useEffect hook
    setIsLoading(true); // Set isLoading to true when stateName changes

    // Create Chat Session
    // Create Chat Session API
    fetch("https://api-dev.on-demand.io/chat/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt",
      },
      body: JSON.stringify({ pluginIds: [], externalUserId: "1" }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract session ID from the response
        const sessionId = data.chatSession.id;

        // Use the session ID for the second API call
        fetch(
          `https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "goDTkO8tLo4XGDtu4yUWkFOT2mPovp9m",
            },
            body: JSON.stringify({
              endpointId: "predefined-openai-gpt4o",
              query: `Hi,AIREV Can you please tell me the water quality of ${stateName}`,
              pluginIds: ["plugin-1713962163", "plugin-1717443567"],
              responseMode: "sync",
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // Handle response from second API call
            console.log(data);
            setQuery(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => console.error("Error:", error));
  }, [stateName]);

  return (
    <div className="w-full h-full overflow-y-auto">
      {query === undefined || query.chatMessage === undefined ? (
        <div className="text-white">
          <div className="text-white w-full h-[25.5vh]  glass rounded-2xl justify-center items-center flex flex-col">
            {" "}
            <InfinitySpin
              width="200"
              color="#aaffdd"
            />
          </div>
        </div>
      ) : (
        <div className="">
          <h2 className=" pl-2 pb-2 border-b border-zinc-500 text-white">
            Water Quality
          </h2>
          <p className="text-sm  font-sans text-justify text-zinc-200 font-light px-2 overflow-hidden pt-2  ">
            {JSON.stringify(query.chatMessage.answer)}
          </p>
        </div>
      )}
    </div>
  );
}
