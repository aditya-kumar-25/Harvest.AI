import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";
import markdownToHtml from "../api/textFormatter";

export function Crop() {
  const [stateName, setStateName] = useRecoilState(StateName);
  const [location, setLocation] = useRecoilState(locationState);
  const [content, setContent] = useState("");

  const [topFour, setTopFour] = useState<string[]>([]);

  useEffect(() => {
    const extractTopFour = () => {
      const cropList = document.getElementById('crop-list');
      const crops = cropList ? cropList.getElementsByTagName('li') : [];
  
      const extractedCrops: string[] = [];
      for (let i = 0; i < 4 && i < crops.length; i++) {
        extractedCrops.push(crops[i].innerText);
      }
      setTopFour(extractedCrops.map((item) => item.split(':')[0]));
    };

    extractTopFour();
  }, [content]);

  useEffect(() => {
    if (!stateName) return; // If stateName is null, exit

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
        const sessionId = data.chatSession.id;

        // Answer Query API
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
              query: `Give me the crop suggestions for ${stateName}`,
              pluginIds: ["plugin-1717467138"],
              responseMode: "sync",
            }),
          }
        )
          .then((response) => response.json())
          .then(async (data) => {
            const res = data?.chatMessage?.answer;
            const html = await markdownToHtml(res);
            setContent(html);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [stateName]);

  const imageUrl = (query: string) => `https://source.unsplash.com/random?${query}`;

  return (
    <div className="w-full h-full ">
      {content.length === 0 ? (
        <div className="text-white">
          <div className="text-white w-full h-[25.5vh] glass rounded-2xl justify-center items-center flex flex-col">
            <InfinitySpin width="200" color="#aaffdd" />
          </div>
        </div>
      ) : (
        <>
          <p className="pl-3 p-1 pb-2 border-b border-zinc-500">Crop Recommendations</p>
          <div className="flex flex-row pt-3">
            <div className="w-2/5 grid grid-cols-2 h-[15vh] p-3 gap-4">
              {topFour.map((crop, index) => (
                <img
                  key={index}
                  className="col-span-1 aspect-square h-[20vh] w-[20vh] rounded-xl border border-slate-500"
                  src={imageUrl(crop)}
                  alt={`crop-${index}`}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                />
              ))}
            </div>
            <div
              id="crop-list"
              dangerouslySetInnerHTML={{ __html: content }}
              className="text-sm font-sans text-justify text-zinc-200 font-light px-4 w-3/5"
            ></div>
          </div>
        </>
      )}
    </div>
  );
}
