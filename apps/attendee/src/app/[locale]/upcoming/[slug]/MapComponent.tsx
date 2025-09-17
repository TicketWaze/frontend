// @ts-nocheck
'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import Event from '@/types/Event';

export default function MapComponent({event} : {event : Event}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const position: [number, number] = [ event.longitude, event.latitude]

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // add style
      center: position, // starting position [lng, lat]
      zoom: 13, // starting zoom
      attributionControl: false,
    });

    new mapboxgl.Marker()
      .setLngLat(position)
      .addTo(mapRef.current);
  }, []);

  return (
    <div className='w-full h-[300px] relative'>
      <div
        style={{ height: '100%' }}
        ref={mapContainerRef}
        className="map-container"
      />
    </div>
  );
};