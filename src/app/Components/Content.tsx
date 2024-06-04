'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { locationState } from '../../state/location';
import { useRecoilState } from 'recoil';
<<<<<<< HEAD
import SoilQualityCheck from './SoilQualityCheck';
=======
import { Weather } from './weather';
import SoilQualityCheck from './soil';
>>>>>>> c0c4db96b85f0c15f51e7ab0d103e6fb8216e47a

// Dynamically import the Map components with ssr disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null); 
    const map = useMap();
    const [location, setLocation] = useRecoilState(locationState);

    useMapEvents({
        click(e) {
            console.log("Latitude: ", e.latlng.lat, "Longitude: ", e.latlng.lng);
            setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

type ContentProps = {
    chatOpened: boolean;
};

export async function getStateFromLatLng(lat: number, lng: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.address) {
            return data.address.state || null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching state:', error);
        return null;
    }
}

const Content: React.FC<ContentProps> = ({ chatOpened }) => {
    const [mapKey, setMapKey] = useState(Date.now());
<<<<<<< HEAD
    const [location, setLocation] = useRecoilState(locationState);
    const [stateName, setStateName] = useState<string | null>(null);

    useEffect(() => {
        setMapKey(Date.now());
    }, [chatOpened]);

    useEffect(() => {
        if (location.lat !== 0 && location.lng !== 0) {
            (async () => {
                try {
                    const state = await getStateFromLatLng(location.lat, location.lng);
                    setStateName(state);
                    console.log(`State: ${state}`);

                    const sessionResponse = await fetch('https://gateway-dev.on-demand.io/chat/v1/sessions', {
                        method: 'POST',
                        headers: {
                            'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "pluginIds": [], "externalUserId": "1" })
                    });

                    const sessionData = await sessionResponse.json();
                    const sessionId = sessionData.chatSession.id;

                    const queryResponse = await fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
                        method: 'POST',
                        headers: {
                            'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "endpointId": "predefined-openai-gpt4o", "query": `What is the climatic condition at ${state} ?`, "pluginIds": ["plugin-1713962163", "plugin-1717421574", "plugin-1717419365"], "responseMode": "sync" })
                    });

                    const queryData = await queryResponse.json();
                    console.log(queryData);
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [location]);

=======
   
>>>>>>> c0c4db96b85f0c15f51e7ab0d103e6fb8216e47a
    return (
        <div className={`grid grid-cols-2 gap-4 p-4 ${chatOpened ? 'w-[75vw]' : 'w-[98vw]'} transition-width duration-500`}>
            <div className="col-span-1 border border-slate-600 h-[29vh] rounded-2xl ">
                <MapContainer style={{ height: "100%", width: "100%", overflow: "hidden", borderRadius: "15px" }}
                    key={mapKey}
                    center={{ lat: 51.505, lng: -0.09 }}
                    zoom={13}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/cqopyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
            <div className="col-span-1 border border-slate-500 h-[29vh] rounded-2xl">
                
                
                 <Weather/>

            </div>
<<<<<<< HEAD
            <div className="col-span-1 border p-2 border-white h-[29vh] rounded-2xl"> Heat Stress level </div>
            <div className="col-span-1 border p-2 border-white h-[29vh] rounded-2xl"> <SoilQualityCheck stateName={stateName}/> </div>
            <div className="col-span-2 border p-2 border-white h-[29vh] rounded-2xl"> Crop suggestion</div>
=======
            <div className="col-span-1 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> Heat Stress level </div>
            <div className="col-span-1 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> <SoilQualityCheck/> </div>
            <div className="col-span-2 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> Crop suggestion</div>
>>>>>>> c0c4db96b85f0c15f51e7ab0d103e6fb8216e47a
        </div>
    );
}

export default Content;
