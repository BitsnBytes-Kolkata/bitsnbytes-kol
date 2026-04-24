"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-pulse text-muted-foreground">
          Loading...
        </div>
      </div>
    ),
  },
);

export default function TeamGlobe() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#0d1b3e",
      showAtmosphere: true,
      atmosphereColor: "#2563eb",
      atmosphereAltitude: 0.15,
      emissive: "#0d2a6e",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#2563eb",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 22.5726, lng: 88.3639 }, // Kolkata coordinates
      autoRotate: true,
      autoRotateSpeed: isMobile ? 0.3 : 0.5,
    }),
    [isMobile],
  );

  const teamArcs = useMemo(
    () => [
      {
        order: 1,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 25.4358, // Prayagraj
        endLng: 81.8463,
        arcAlt: 0.12,
        color: "#2563eb",
      },
      {
        order: 2,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 12.9716, // Bangalore
        endLng: 77.5946,
        arcAlt: 0.25,
        color: "#38bdf8",
      },
      {
        order: 3,
        startLat: 25.4358, // Prayagraj
        startLng: 81.8463,
        endLat: 12.9716, // Bangalore
        endLng: 77.5946,
        arcAlt: 0.2,
        color: "#0d2a6e",
      },
      {
        order: 4,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 28.6139, // Delhi
        endLng: 77.209,
        arcAlt: 0.15,
        color: "#2563eb",
      },
      {
        order: 5,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 26.8467, // Lucknow
        endLng: 80.9462,
        arcAlt: 0.1,
        color: "#38bdf8",
      },
      {
        order: 6,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 26.8467, // Lucknow
        endLng: 80.9462,
        arcAlt: 0.12,
        color: "#0d2a6e",
      },
      {
        order: 7,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 19.076, // Mumbai
        endLng: 72.8777,
        arcAlt: 0.22,
        color: "#2563eb",
      },
      {
        order: 8,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 13.0827, // Chennai
        endLng: 80.2707,
        arcAlt: 0.18,
        color: "#38bdf8",
      },
      {
        order: 9,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 21.1702, // Surat
        endLng: 72.8311,
        arcAlt: 0.2,
        color: "#2563eb",
      },
      {
        order: 10,
        startLat: 22.5726, // Kolkata
        startLng: 88.3639,
        endLat: 30.901, // Ludhiana
        endLng: 75.8573,
        arcAlt: 0.18,
        color: "#38bdf8",
      },
      {
        order: 11,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 25.4358, // Prayagraj
        endLng: 81.8463,
        arcAlt: 0.16,
        color: "#0d2a6e",
      },
      {
        order: 12,
        startLat: 28.6139, // Delhi
        startLng: 77.209,
        endLat: 19.076, // Mumbai
        endLng: 72.8777,
        arcAlt: 0.2,
        color: "#2563eb",
      },
    ],
    [],
  );

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 h-full w-full">
        <World data={teamArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}

