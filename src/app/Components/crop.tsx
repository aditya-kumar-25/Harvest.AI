import { locationState, StateName } from "@/state/location";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useRecoilState } from "recoil";
import markdownToHtml from "../api/textFormatter";

export function Crop() {
  const [stateName, setStateName] = useRecoilState(StateName);
  const [location, setLocation] = useRecoilState(locationState);
  const [content, setContent] = useState("");

  const [topFour, setTopFour] = useState<any>([]);

  useEffect(() => {

    const extractTopFour = () => {
        const cropList = document.getElementById('crop-list');

        const crops = cropList ? cropList.getElementsByTagName('li') : [];
  
        const extractedCrops = [];
        for (let i = 0; i < 4 && i < crops.length; i++) {
          extractedCrops.push(crops[i].innerText);
        }
        setTopFour(extractedCrops.map((item) => item.split(':')[0]));
        console.log(extractedCrops.map((item) => item.split(':')[0]));
    };

    extractTopFour();

  }, [content]);

  useEffect(() => {
    if (!stateName) return; // If stateName is null, exit

    fetch("https://gateway-dev.on-demand.io/chat/v1/sessions", {
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
          `https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt",
            },
            body: JSON.stringify({
              endpointId: "predefined-openai-gpt4o",
              query: `Give me the crop suggesstions for ${stateName}`,
              pluginIds: ["plugin-1717467138"],
              responseMode: "sync",
            }),
          }
        )
          .then((response) => response.json())
          .then(async (data) => {
            // Handle response data here
            console.log(data);
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

  return (
    <div className="w-full h-full ">
      {content.length === 0 ? (
        <div className="text-white">
          <div className="text-white w-full h-[25.5vh]  glass rounded-2xl justify-center items-center flex flex-col">
            
            <InfinitySpin
              width="200"
              color="#aaffdd"
            />
          </div>
        </div>
      ) : (<>
        <p className="pl-3 p-1 pb-2 border-b  border-zinc-500 ">Crop Recommendations</p>
        <div className=" flex flex-row pt-3">
            
            <div className="w-2/5 grid grid-cols-2 h-[15vh] p-3 gap-4">
                
            <img className=" col-span-1 aspect-square h-[20vh] w-[20vh] rounded-xl border border-slate-500"  src={`https://source.unsplash.com/featured/?${topFour[0]}`} alt="i1" />
            <img className=" col-span-1 h-[20vh] w-[20vh] rounded-xl border border-slate-500" src={`https://source.unsplash.com/featured/?${topFour[1]}`} alt="i2" />
            <img className=" col-span-1 h-[20vh] w-[20vh] border rounded-xl border-slate-500" src={`https://source.unsplash.com/featured/?${topFour[2]}`} alt="i3" />
            <img className=" col-span-1 h-[20vh] w-[20vh] border rounded-xl border-slate-500" src={`https://source.unsplash.com/featured/?${topFour[3]}`} alt="i4" />
            </div>
        <div
        id="crop-list"
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-sm  font-sans text-justify text-zinc-200 font-light px-4  w-3/5"
        ></div>
        </div></>
      )}
    </div>
  );
}
