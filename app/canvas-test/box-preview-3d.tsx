import { useRef } from "react";
import * as THREE from "three";
import type { Face, FaceDesigns } from "./face.model";
import { Canvas } from "@react-three/fiber";
import { useTexture, OrbitControls } from "@react-three/drei";
import { faceToThreeJsIndex as getThreeJsIndexForFace } from "./threejs/helpers";

export type BoxPreview3DProps = {
    faceDesigns: FaceDesigns;
    widthCm: number;
    heightCm: number;
    depthCm: number;
}

function BoxPreview3DWithFiberThreeReactCanvasPrivate({ faceDesigns, widthCm, heightCm, depthCm }: BoxPreview3DProps) {
    // if (widthCm === 0 || heightCm === 0 || depthCm === 0) {
    //     return null;
    // }

    return (
        <div>
            <Canvas>
                <color attach="background" args={['#f5efe6']} />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

                <BoxPreview3DMesh widthCm={widthCm} heightCm={heightCm} depthCm={depthCm} faceDesigns={faceDesigns} />

                <OrbitControls />
            </Canvas>
        </div>
    );
}

// export const BoxPreview3DWithFiberThreeReactCanvas = React.memo(BoxPreview3DWithFiberThreeReactCanvasPrivate);
export const BoxPreview3DWithFiberThreeReactCanvas = BoxPreview3DWithFiberThreeReactCanvasPrivate;

function BoxPreview3DMesh({ faceDesigns, widthCm, heightCm, depthCm }: BoxPreview3DProps) {
    const meshRef = useRef<THREE.Mesh>(null!);

    // useEffect(() => {
    //     if (Array.isArray(meshRef.current.material)) {
    //         meshRef.current.material.forEach((m) => m.needsUpdate = true);
    //     } else {
    //         meshRef.current.material.needsUpdate = true;
    //     }
    // }, [faceDesigns]);

    return (
        <mesh
            position={[0, 0, 0]}
            ref={meshRef}
        >
            <BoxPreview3DBox widthCm={widthCm} heightCm={heightCm} depthCm={depthCm} faceDesigns={faceDesigns} />
        </mesh>
    );
}

function BoxPreview3DBox({ widthCm, heightCm, depthCm, faceDesigns }: BoxPreview3DProps) {
    const meshSides = (Object.keys(faceDesigns) as Face[]).map((face) => {
        const threeJsIndex = getThreeJsIndexForFace(face);
        return faceDesigns[face].dataUrlTexture
            ? <BoxPreview3DMeshStandardMaterialWithTexture
                faceDataUrlTexture={faceDesigns[face].dataUrlTexture}
                face={face}
                index={threeJsIndex}
                key={`${threeJsIndex}-texture-${faceDesigns[face].dataUrlTexture}`}
                />
            : <meshStandardMaterial attach={`material-${threeJsIndex}`} color={'orange'} key={`${threeJsIndex}-standardColor`} />;
    });

    return (
        <>
            <boxGeometry args={[widthCm / 100, heightCm / 100, depthCm / 100]} />
            {/* <boxGeometry args={[3, 3, 3]} /> */}
            {meshSides}
        </>
    );
}

function BoxPreview3DMeshStandardMaterialWithTexture({ faceDataUrlTexture, face, index }: { faceDataUrlTexture: string, face: Face, index: number }) {
    const faceTexture = useTexture(faceDataUrlTexture);
    return <meshStandardMaterial attach={`material-${index}`} map={faceTexture} key={`face-${face}-${faceDataUrlTexture}`} />
}
