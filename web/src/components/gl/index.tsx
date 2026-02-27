"use client";

import { Effects } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Particles } from "./particles";
import { VignetteShader } from "./shaders/vignetteShader";

// Hardcoded values (originally from leva controls in the template)
const CONFIG = {
    speed: 1.0,
    noiseScale: 0.6,
    noiseIntensity: 0.52,
    timeScale: 1,
    focus: 3.8,
    aperture: 1.79,
    pointSize: 10.0,
    opacity: 0.8,
    planeScale: 10.0,
    size: 512 as 256 | 512 | 1024,
    vignetteDarkness: 1.5,
    vignetteOffset: 0.4,
};

export const GL = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === "light";

    return (
        <div
            id="webgl"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <Canvas
                camera={{
                    position: [
                        1.2629783123314589, 2.664606471394044, -1.8178993743288914,
                    ],
                    fov: 50,
                    near: 0.01,
                    far: 300,
                }}
            >
                <color attach="background" args={[isLight ? "#ffffff" : "#000000"]} />
                <Particles
                    speed={CONFIG.speed}
                    aperture={CONFIG.aperture}
                    focus={CONFIG.focus}
                    size={CONFIG.size}
                    noiseScale={CONFIG.noiseScale}
                    noiseIntensity={CONFIG.noiseIntensity}
                    timeScale={CONFIG.timeScale}
                    pointSize={CONFIG.pointSize}
                    opacity={CONFIG.opacity}
                    planeScale={CONFIG.planeScale}
                    useManualTime={false}
                    manualTime={0}
                    introspect={false}
                    theme={isLight ? "light" : "dark"}
                />
                <Effects multisamping={0} disableGamma>
                    {/* @ts-ignore */}
                    <shaderPass
                        args={[VignetteShader]}
                        uniforms-darkness-value={CONFIG.vignetteDarkness}
                        uniforms-offset-value={CONFIG.vignetteOffset}
                        uniforms-uBgColor-value={new THREE.Color(isLight ? 0xffffff : 0x000000)}
                    />
                </Effects>
            </Canvas>
        </div>
    );
};
