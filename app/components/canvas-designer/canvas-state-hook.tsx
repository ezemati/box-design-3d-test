import {
    getInitialBoxDimensions,
    type BoxDimensions,
} from '@/features/canvas/models/box';
import type { Face } from '@/features/canvas/models/face';
import {
    getInitialFaceDesign,
    getInitialFaceDesigns,
    type FaceDesigns,
} from '@/features/canvas/models/face-design';
import {
    getInitialFaceDimensions,
    type FaceDimensions,
} from '@/features/canvas/models/face-dimensions';
import * as fabric from 'fabric';
import { useState, type Dispatch, type SetStateAction } from 'react';

export const useCanvasFabricState = (): [
    fabric.Canvas | null,
    Dispatch<SetStateAction<fabric.Canvas | null>>,
    BoxDimensions,
    Dispatch<SetStateAction<BoxDimensions>>,
    FaceDimensions,
    Dispatch<SetStateAction<FaceDimensions>>,
    FaceDesigns,
    Dispatch<SetStateAction<FaceDesigns>>,
    Face,
    Dispatch<SetStateAction<Face>>,
    string,
    Dispatch<SetStateAction<string>>,
    fabric.FabricObject[],
    Dispatch<SetStateAction<fabric.FabricObject[]>>,
] => {
    const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(
        null,
    );
    const [boxDimensions, setBoxDimensions] = useState(() =>
        getInitialBoxDimensions(),
    );
    const [faceDimensions, setFaceDimensions] = useState(() =>
        getInitialFaceDimensions(),
    );
    const [faceDesigns, setFaceDesigns] = useState(() =>
        getInitialFaceDesigns(),
    );
    const [selectedFace, setSelectedFace] = useState<Face>('front');
    const [currentFaceDesignJson, setCurrentFaceDesignJson] = useState<string>(
        () => getInitialFaceDesign('front').jsonDesign,
    );
    const [activeObjects, setActiveObjects] = useState<fabric.FabricObject[]>(
        [],
    );

    return [
        canvasInstance,
        setCanvasInstance,
        boxDimensions,
        setBoxDimensions,
        faceDimensions,
        setFaceDimensions,
        faceDesigns,
        setFaceDesigns,
        selectedFace,
        setSelectedFace,
        currentFaceDesignJson,
        setCurrentFaceDesignJson,
        activeObjects,
        setActiveObjects,
    ];
};
