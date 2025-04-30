import { useCallback, useEffect, useState } from 'react';
import { getAllFaces, getFaceDimensions, type Face, type FaceDimensions } from './face.model';
import { produce } from "immer";
import { FabricBoxDesigner } from './fabricjs/fabric-box-designer';

export type DesignerContainerProps = {
    productId: string;
};

type FaceDesign = {
    face: Face;
    jsonDesign: string;
}

export function DesignerContainer({ productId }: DesignerContainerProps) {
    const [faceDimensions, setFaceDimensions] = useState<FaceDimensions>(() => getFaceDimensions(0, 0, 0));

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 200;
        const heightCm = 150;
        const depthCm = 100;
        const faceDimensions = getFaceDimensions(widthCm, heightCm, depthCm);
        setFaceDimensions(faceDimensions);
    }, [productId]);

    const [selectedBoxFace, setSelectedBoxFace] = useState<Face>("front");
    const [faceDesigns, setFaceDesigns] = useState<Record<Face, FaceDesign>>(() => createInitialFaceDesignsObject());

    const [currentFaceDesign, setCurrentFaceDesign] = useState<string>("");

    const handleCanvasChange = useCallback((jsonDesign: string) => {
        setFaceDesigns(
            produce((draft) => {
                draft[selectedBoxFace].jsonDesign = jsonDesign;
            })
        );
    }, [selectedBoxFace]);

    const handleFaceChange = (selectedFace: Face) => {
        setSelectedBoxFace(selectedFace);
        setCurrentFaceDesign(faceDesigns[selectedFace].jsonDesign);
    }

    return (
        <div>
            <select value={selectedBoxFace} id="selectedFace" onChange={(e) => handleFaceChange(e.target.value as Face)}>
                {
                    getAllFaces().map((face) => {
                        return <option key={face} value={face}>{face}</option>
                    })
                }
            </select>
            <FabricBoxDesigner
                face={selectedBoxFace}
                faceWidthPx={faceDimensions[selectedBoxFace].faceWidthPx + 20}
                faceHeightPx={faceDimensions[selectedBoxFace].faceHeightPx + 20}
                faceDesignJson={currentFaceDesign}
                onChange={handleCanvasChange}
            />
        </div>
    );
};

function createInitialFaceDesignsObject(): Record<Face, FaceDesign> {
    console.log("Creating initial face designs object...");
    return {
        front: {
            face: "front",
            jsonDesign: ""
        },
        back: {
            face: "back",
            jsonDesign: ""
        },
        top: {
            face: "top",
            jsonDesign: ""
        },
        bottom: {
            face: "bottom",
            jsonDesign: ""
        },
        left: {
            face: "left",
            jsonDesign: ""
        },
        right: {
            face: "right",
            jsonDesign: ""
        },
    };
}
