import { produce } from 'immer';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { BoxPreview3DWithFiberThreeReactCanvas } from './box-preview-3d';
import { newBoxDimensions, type BoxDimensions } from './box.model';
import { FabricBoxDesigner } from './fabricjs/fabric-box-designer';
import {
    getAllFaces,
    getFaceDimensions,
    type Face,
    type FaceDesigns,
    type FaceDimensions,
} from './face.model';

export interface DesignerContainerProps {
    productId: string;
}

export function DesignerContainer({
    productId,
}: DesignerContainerProps): JSX.Element {
    const [boxDimensions, setBoxDimensions] = useState<BoxDimensions>(() =>
        newBoxDimensions(0, 0, 0),
    );
    const [faceDimensions, setFaceDimensions] = useState<FaceDimensions>(() =>
        getFaceDimensions(0, 0, 0),
    );

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 300;
        const heightCm = 200;
        const depthCm = 100;
        const faceDimensions = getFaceDimensions(widthCm, heightCm, depthCm);
        setFaceDimensions(faceDimensions);
        setBoxDimensions(newBoxDimensions(widthCm, heightCm, depthCm));
    }, [productId]);

    const [selectedBoxFace, setSelectedBoxFace] = useState<Face>('front');
    const [faceDesigns, setFaceDesigns] = useState<FaceDesigns>(() =>
        createInitialFaceDesignsObject(),
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

function createInitialFaceDesignsObject(): FaceDesigns {
    console.log('Creating initial face designs object...');
    return {
        front: {
            face: 'front',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        back: {
            face: 'back',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        top: {
            face: 'top',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        bottom: {
            face: 'bottom',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        left: {
            face: 'left',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        right: {
            face: 'right',
            jsonDesign: '',
            dataUrlTexture: '',
        },
    };
}
