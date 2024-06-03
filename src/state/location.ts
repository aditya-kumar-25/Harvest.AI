import { atom } from "recoil";

const locationState = atom({
    key: "locationState",
    default: { lat: 0, lng: 0 },
    });