import { atom } from "recoil";

export const locationState = atom({
    key: "locationState",
    default: { lat: 23.4241, lng: 23.4241 },
    });