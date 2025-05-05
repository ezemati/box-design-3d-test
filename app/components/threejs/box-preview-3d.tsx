/* eslint-disable react/no-unknown-property */
import type { Face } from '@/features/canvas/models/face';
import { useStore } from '@/store/store';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useRef, type JSX } from 'react';
import * as THREE from 'three';
import { faceToThreeJsIndex as getThreeJsIndexForFace } from './helpers';

export interface BoxPreview3DProps {
    widthCm: number;
    heightCm: number;
    depthCm: number;
}

function BoxPreview3DWithFiberThreeReactCanvasPrivate({
    widthCm,
    heightCm,
    depthCm,
}: BoxPreview3DProps): JSX.Element {
    // if (widthCm === 0 || heightCm === 0 || depthCm === 0) {
    //     return null;
    // }

    return (
        <div>
            <Canvas>
                <color attach="background" args={['#f5efe6']} />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    decay={0}
                    intensity={Math.PI}
                />
                <pointLight
                    position={[-10, -10, -10]}
                    decay={0}
                    intensity={Math.PI}
                />

                <BoxPreview3DMesh
                    widthCm={widthCm}
                    heightCm={heightCm}
                    depthCm={depthCm}
                />

                <OrbitControls />
            </Canvas>
        </div>
    );
}

export const BoxPreview3DWithFiberThreeReactCanvas = React.memo(
    BoxPreview3DWithFiberThreeReactCanvasPrivate,
);

function BoxPreview3DMesh({
    widthCm,
    heightCm,
    depthCm,
}: BoxPreview3DProps): JSX.Element {
    const meshRef = useRef<THREE.Mesh>(null);

    // useEffect(() => {
    //     if (Array.isArray(meshRef.current.material)) {
    //         meshRef.current.material.forEach((m) => m.needsUpdate = true);
    //     } else {
    //         meshRef.current.material.needsUpdate = true;
    //     }
    // }, [faceDesigns]);

    return (
        <mesh position={[0, 0, 0]} ref={meshRef}>
            <BoxPreview3DBox
                widthCm={widthCm}
                heightCm={heightCm}
                depthCm={depthCm}
            />
        </mesh>
    );
}

function BoxPreview3DBox({
    widthCm,
    heightCm,
    depthCm,
}: BoxPreview3DProps): JSX.Element {
    const faceDesigns = useStore((state) => state.faceDesigns);

    const meshSides = (Object.keys(faceDesigns) as Face[]).map((face) => {
        const threeJsIndex = getThreeJsIndexForFace(face);
        if (faceDesigns[face].dataUrlTexture !== '') {
            return (
                <BoxPreview3DMeshStandardMaterialWithTexture
                    faceDataUrlTexture={faceDesigns[face].dataUrlTexture}
                    face={face}
                    index={threeJsIndex}
                    key={`${threeJsIndex.toString()}-texture-${faceDesigns[face].dataUrlTexture}`}
                />
            );
        }

        return (
            <meshStandardMaterial
                attach={`material-${threeJsIndex.toString()}`}
                color={'orange'}
                key={`${threeJsIndex.toString()}-standardColor`}
            />
        );
    });

    return (
        <>
            <boxGeometry
                args={[widthCm / 100, heightCm / 100, depthCm / 100]}
            />
            {/* <boxGeometry args={[3, 3, 3]} /> */}
            {meshSides}
        </>
    );
}

function BoxPreview3DMeshStandardMaterialWithTexture({
    faceDataUrlTexture,
    face,
    index,
}: {
    faceDataUrlTexture: string;
    face: Face;
    index: number;
}): JSX.Element {
    const faceTexture = useTexture(faceDataUrlTexture);
    return (
        <meshStandardMaterial
            attach={`material-${index.toString()}`}
            map={faceTexture}
            key={`face-${face}-${faceDataUrlTexture}`}
        />
    );
}
