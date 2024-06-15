import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getStateFromLatLng } from "./Content";
import { InfinitySpin } from "react-loader-spinner";

interface ChatQuery {
  chatMessage?: {
    answer?: string;
  };
}

export function Weather() {
  const [location, setLocation] = useRecoilState(locationState);
  const [stateName, setStateName] = useRecoilState(StateName);
  const [query, setQuery] = useState<ChatQuery>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (location.lat !== 0 && location.lng !== 0) {
      setIsLoading(true);

      (async () => {
        try {
          const state = await getStateFromLatLng(location.lat, location.lng);
          setStateName(state);
          console.log(`State: ${state}`);

          const sessionResponse = await fetch(
            "https://gateway-dev.on-demand.io/chat/v1/sessions",
            {
              method: "POST",
              headers: {
                apikey: "zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ pluginIds: [], externalUserId: "1" }),
            }
          );

          const sessionData = await sessionResponse.json();
          const sessionId = sessionData.chatSession.id;

          const queryResponse = await fetch(
            `https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`,
            {
              method: "POST",
              headers: {
                apikey: "zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                endpointId: "predefined-openai-gpt4o",
                query: `What is the climatic condition at ${state} with ${location.lat}N and ${location.lng}E in 25 words ?`,
                pluginIds: ["plugin-1715797457", "plugin-1713962163"],
                responseMode: "sync",
              }),
            }
          );

          const queryData = await queryResponse.json();
          setQuery(queryData);
          console.log(queryData);
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
      })();
    }
  }, [location, setStateName]);

  if (isLoading) {
    return (
      <div className="text-white w-full h-full glass rounded-2xl justify-center items-center flex flex-col">
        <InfinitySpin width="200" color="#aaffdd" />
      </div>
    );
  }

  return (
    <div className="flex flex-row  items-center h-[29vh] justify-center">
      <div className="w-[42%]  flex flex-col justify-center items-center align-middle">
        {query.chatMessage?.answer
          ? getWeatherCondition(query.chatMessage.answer)
          : ""}
      </div>
      <div className="glass rounded-tr-2xl rounded-br-2xl h-full flex flex-col items-center justify-center px-4 border-l">

        {!query.chatMessage ? (
          
            <div className="text-white w-full h-full glass rounded-2xl justify-center items-center flex flex-col">
              <InfinitySpin width="200" color="#aaffdd" />
            </div>
          
        ) : (
          <p className="text-sm font-sans text-justify text-zinc-200 font-light overflow-y-auto">
            {JSON.stringify(query.chatMessage.answer)}
          </p>
                )}
                </div>
      </div>
    
  );
}

function getWeatherCondition(answer: string | undefined) {
  if (!answer) {
    return null;
  }

  const sunnyKeywords = [
    "sunny", "sunshine", "sunlight", "sun", "sunny day", "humidity", "hot", "heat", "warm", "warmth", "sweat", "sweaty", "sweating", "desert",
  ];
  const showerKeywords = [
    "shower", "showering", "showered", "showering day", "showered day", "rain", "raining", "wet",
  ];
  const snowyKeywords = [
    "snow", "snowy", "snowing", "snowfall", "snowflakes", "snowstorm", "blizzard", "sleet", "flurries", "cold", "ice", "icy", "frost", "frosty",
  ];
  const stormyKeywords = [
    "storm", "stormy", "thunderstorm", "thunder", "lightning", "thundering", "storming", "hurricane", "tornado", "cyclone",
  ];

  if (sunnyKeywords.some((keyword) => answer.includes(keyword))) {
    return (
      <div className="icon sunny">
        <div className="sun">
          <div className="rays"></div>
        </div>
      </div>
    );
  } else if (showerKeywords.some((keyword) => answer.includes(keyword))) {
    return (
      <div className="icon rainy">
        <div className="cloud"></div>
        <div className="rain"></div>
      </div>
    );
  } else if (snowyKeywords.some((keyword) => answer.includes(keyword))) {
    return (
      <div className="icon flurries -translate-y-5">
        <div className="cloud"></div>
        <div className="snow">
          <div className="flake"></div>
          <div className="flake"></div>
        </div>
      </div>
    );
  } else if (stormyKeywords.some((keyword) => answer.includes(keyword))) {
    return (
      <div className="icon thunder-storm">
        <div className="cloud"></div>
        <div className="lightning">
          <div className="bolt"></div>
          <div className="bolt"></div>
        </div>
      </div>
    );
  }
  return null;
}
