import { atom } from "recoil";

export const locationState = atom({
    key: "locationState",
    default: { lat: 24.4539, lng:54.3773 },
    });

export const StateName = atom({
    key: "stateName",
    default: null,
    });