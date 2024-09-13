import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getStateFromLatLng } from "./Content";
import { InfinitySpin } from "react-loader-spinner";
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

interface ChatQuery {
  answer?: string;
}

export function Weather() {
  const [location] = useRecoilState(locationState);
  const [, setStateName] = useRecoilState(StateName);
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

          let data = JSON.stringify({
            "pluginIds": [
              "plugin-1717419365",
              "plugin-1713962163"
            ],
            "externalUserId": "1"
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.on-demand.io/chat/v1/sessions',
            headers: { 
              'apikey': 'SyuuzaftNhzKZoZNFZz33xxMZblRer4p'!, 
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
          
          const queryData = await submitQuery(
            'SyuuzaftNhzKZoZNFZz33xxMZblRer4p'!,
            sessionId,
            `What is the climatic condition at ${state} with ${location.lat}N and ${location.lng}E in 25 words ?`
          );

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
        {query?.answer
          ? getWeatherCondition(query.answer)
          : ""}
      </div>
      <div className="glass rounded-tr-2xl rounded-br-2xl h-full flex flex-col items-center justify-center px-4 border-l">
        {!query.answer ? (
          <div className="text-white w-full h-full glass rounded-2xl justify-center items-center flex flex-col">
            <InfinitySpin width="200" color="#aaffdd" />
          </div>
        ) : (
          <p className="text-sm font-sans text-justify text-zinc-200 font-light overflow-y-auto">
            {query.answer}
          </p>
        )}
      </div>
    </div>
  );
}

async function submitQuery(apiKey: string, sessionId: string, query: string) {
  const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = {
    'apikey': apiKey,
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify({
    endpointId: 'predefined-openai-gpt4o',
    query: query,
    pluginIds: ["plugin-1717419365", "plugin-1713962163"],
    responseMode: 'sync'
  });

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.data; // Return the data object directly
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to submit query: ${error.response?.data?.message || error.message}`);
    } else {
      if (error instanceof Error) {
        throw new Error(`Failed to submit query: ${error.message}`);
      } else {
        throw new Error('Failed to submit query: An unknown error occurred');
      }
    }
  }
}

function getWeatherCondition(answer: string | undefined) {
  console.log(answer);
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