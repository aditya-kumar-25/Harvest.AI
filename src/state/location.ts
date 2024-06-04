import { atom } from "recoil";

export const locationState = atom({
    key: "locationState",
    default: { lat: 24.6637, lng: 93.9063 },
    });

export const StateName = atom({
    key: "stateName",
    default: null,
    });