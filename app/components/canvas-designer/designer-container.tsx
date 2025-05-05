import { getAllFaces, type Face } from '@/features/canvas/models/face';
import { useStore } from '@/store/store';
import { useEffect, type JSX } from 'react';
import { ControlPanel } from '../control-panel/control-panel';
import { FabricBoxDesigner } from '../fabricjs/fabric-box-designer';
import { BoxPreview3DWithFiberThreeReactCanvas } from '../threejs/box-preview-3d';

export interface DesignerContainerProps {
    productId: string;
}

export function DesignerContainer({
    productId,
}: DesignerContainerProps): JSX.Element {
    const boxDimensions = useStore((state) => state.boxDimensions);
    const faceDimensions = useStore((state) => state.faceDimensions);
    const selectedFace = useStore((state) => state.currentFace);

    const loadBoxDimensions = useStore((state) => state.loadBoxDimensions);
    const changeFace = useStore((state) => state.changeFace);

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 300;
        const heightCm = 200;
        const depthCm = 100;

        console.log(
            `Using dimensions (${widthCm.toString()}, ${heightCm.toString()}, ${depthCm.toString()}) for product with Id ${productId}`,
        );

        loadBoxDimensions(widthCm, heightCm, depthCm);
    }, [loadBoxDimensions, productId]);

    const handleFaceChange = (selectedFace: Face): void => {
        changeFace(selectedFace);
    };

    return (
        <div>
            <select
                value={selectedFace}
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ControlPanel />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <FabricBoxDesigner
                        faceWidthPx={
                            faceDimensions[selectedFace].faceWidthPx + 20
                        }
                        faceHeightPx={
                            faceDimensions[selectedFace].faceHeightPx + 20
                        }
                    />
                    <BoxPreview3DWithFiberThreeReactCanvas
                        widthCm={boxDimensions.widthCm}
                        heightCm={boxDimensions.heightCm}
                        depthCm={boxDimensions.depthCm}
                    />
                </div>
            </div>
        </div>
    );
}
