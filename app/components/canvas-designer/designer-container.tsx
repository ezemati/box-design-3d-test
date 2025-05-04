import {
    getBoxDimensions,
    getInitialBoxDimensions,
} from '@/features/canvas/models/box';
import { getAllFaces, type Face } from '@/features/canvas/models/face';
import {
    getInitialFaceDesigns,
    type FaceDesigns,
} from '@/features/canvas/models/face-design';
import {
    getFaceDimensions,
    getInitialFaceDimensions,
} from '@/features/canvas/models/face-dimensions';
import { produce } from 'immer';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { FabricBoxDesigner } from '../fabricjs/fabric-box-designer';
import { BoxPreview3DWithFiberThreeReactCanvas } from '../threejs/box-preview-3d';

export interface DesignerContainerProps {
    productId: string;
}

export function DesignerContainer({
    productId,
}: DesignerContainerProps): JSX.Element {
    const [boxDimensions, setBoxDimensions] = useState(() =>
        getInitialBoxDimensions(),
    );
    const [faceDimensions, setFaceDimensions] = useState(() =>
        getInitialFaceDimensions(),
    );

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 300;
        const heightCm = 200;
        const depthCm = 100;
        const faceDimensions = getFaceDimensions(widthCm, heightCm, depthCm);
        setFaceDimensions(faceDimensions);
        setBoxDimensions(getBoxDimensions(widthCm, heightCm, depthCm));
    }, [productId]);

    const [selectedBoxFace, setSelectedBoxFace] = useState<Face>('front');
    const [faceDesigns, setFaceDesigns] = useState<FaceDesigns>(() =>
        getInitialFaceDesigns(),
    );

    const [currentFaceDesign, setCurrentFaceDesign] = useState<string>('');

    const handleCanvasChange = useCallback(
        (jsonDesign: string, dataUrlTexture: string) => {
            setFaceDesigns(
                produce((draft) => {
                    draft[selectedBoxFace].jsonDesign = jsonDesign;
                    draft[selectedBoxFace].dataUrlTexture = dataUrlTexture;
                }),
            );
        },
        [selectedBoxFace],
    );

    const handleFaceChange = (selectedFace: Face): void => {
        setSelectedBoxFace(selectedFace);
        setCurrentFaceDesign(faceDesigns[selectedFace].jsonDesign);
    };

    return (
        <div>
            <select
                value={selectedBoxFace}
                id="selectedFace"
                onChange={(e) => {
                    handleFaceChange(e.target.value as Face);
                }}
            >
                {getAllFaces().map((face) => {
                    return (
                        <option key={face} value={face}>
                            {face}
                        </option>
                    );
                })}
            </select>
            <div style={{ display: 'flex' }}>
                <FabricBoxDesigner
                    face={selectedBoxFace}
                    faceWidthPx={
                        faceDimensions[selectedBoxFace].faceWidthPx + 20
                    }
                    faceHeightPx={
                        faceDimensions[selectedBoxFace].faceHeightPx + 20
                    }
                    faceDesignJson={currentFaceDesign}
                    onChange={handleCanvasChange}
                />
                <BoxPreview3DWithFiberThreeReactCanvas
                    widthCm={boxDimensions.widthCm}
                    heightCm={boxDimensions.heightCm}
                    depthCm={boxDimensions.depthCm}
                    faceDesigns={faceDesigns}
                />
            </div>
        </div>
    );
}
