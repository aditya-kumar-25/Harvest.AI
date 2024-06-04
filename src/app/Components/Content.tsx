'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { locationState } from '../../state/location';
import { useRecoilState } from 'recoil';
import { Weather } from './weather';
import SoilQualityCheck from './soil';
import { Heat } from './water';
import { Crop } from './crop';

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
   
    return (
        <div className={`grid grid-cols-2 gap-4 p-4 ${chatOpened ? 'w-[75vw]' : 'w-[98vw]'} transition-width duration-500`}>
            <div className="col-span-1 border border-slate-600 h-[29vh] rounded-2xl ">
                <MapContainer style={{ height: "100%", width: "100%", overflow: "hidden", borderRadius: "15px" }}
                    key={mapKey}
                    center={{ lat: 24.6637, lng:93.9063 }}
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
            <div className="col-span-1 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> <Heat/> </div>
            <div className="col-span-1 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> <SoilQualityCheck/> </div>
            <div className="col-span-2 border p-2 border-slate-500 glass h-[29vh] rounded-2xl"> <Crop/></div>
        </div>
    );
}

export default Content;
