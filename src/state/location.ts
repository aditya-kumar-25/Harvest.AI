import { atom } from "recoil";

type StateNameType = string | null;

// Define a type for the location state
interface LocationState {
  lat: number;
  lng: number;
}

export const locationState = atom<LocationState>({
    key: "locationState",
    default: { lat: 24.4539, lng:54.3773 },
    });

export const StateName = atom<StateNameType>({
    key: "stateName",
    default: null,
    });