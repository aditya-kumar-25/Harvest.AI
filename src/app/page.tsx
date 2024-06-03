"use client";

import { useState } from "react";
import Content from "./Components/Content";
import Sidenav from "./Components/Sidenav";
import { BsMenuButtonFill } from "react-icons/bs";
import { RecoilRoot } from "recoil";

export default function Home() {
  const [chatOpened, setChatOpened] = useState<Boolean>(false);

  return (
    <RecoilRoot>
    <div className="">
      {!chatOpened && <button
        className="z-[1] fixed top-2 left-2"
        onClick={() => setChatOpened(!chatOpened)} 
        title={chatOpened ? "Close chat" : "Open chat"}
      >
        <BsMenuButtonFill size={20} className="text-gray-300" />
      </button>}
      <div className="flex justify-between">
        <Sidenav chatOpened={chatOpened} setChatOpened={setChatOpened} />
        <Content  chatOpened={chatOpened} />
      </div>
    </div>
    </RecoilRoot>

  );
}
