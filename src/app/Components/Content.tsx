'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
// Dynamically import the Map components with ssr disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null); 
    const map = useMap();

    useMapEvents({
        click(e) {
            console.log("Latitude: ", e.latlng.lat, "Longitude: ", e.latlng.lng);
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
  chatOpened: Boolean;
};


 const Content: React.FC<ContentProps> = ({ chatOpened }) => {    const [mapKey, setMapKey] = useState(Date.now());

    useEffect(() => {
        // Update the mapKey state variable whenever you want to create a new map instance
        setMapKey(Date.now());
    }, [/* Add your dependencies here */]);

    return (
        <div className={`grid grid-cols-2 gap-4 p-4 ${chatOpened ? 'w-[75vw]' : 'w-[98vw]'} transition-width duration-500 `}>
            <div className="col-span-1 border border-white h-[29vh] rounded-2xl">
                <MapContainer style={{ height: "100%", width: "100%", overflow: "hidden", borderRadius: "15px" }}
                                    key={mapKey}

                    center={{ lat: 23.4241, lng: 53.8478 }}
                    zoom={13}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
            <div className="col-span-1 border p-2 border-white h-[29vh] rounded-2xl"> 01</div>
            <div className="col-span-1 border p-2 border-white h-[29vh] rounded-2xl"> 02</div>
            <div className="col-span-1 border p-2 border-white h-[29vh] rounded-2xl"> 03</div>
            <div className="col-span-2 border p-2 border-white h-[29vh] rounded-2xl"> 04</div>
        </div>
    );
}

export default Content;