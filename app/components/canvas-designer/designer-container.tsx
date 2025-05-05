import { changeFace, loadBoxDimensions } from '@/features/canvas/canvasSlice';
import { getAllFaces, type Face } from '@/features/canvas/models/face';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
    const dispatch = useAppDispatch();

    const boxDimensions = useAppSelector((state) => state.canvas.boxDimensions);
    const faceDimensions = useAppSelector(
        (state) => state.canvas.faceDimensions,
    );
    const selectedFace = useAppSelector((state) => state.canvas.currentFace);

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 300;
        const heightCm = 200;
        const depthCm = 100;

        console.log(
            `Using dimensions (${widthCm.toString()}, ${heightCm.toString()}, ${depthCm.toString()}) for product with Id ${productId}`,
        );

        dispatch(loadBoxDimensions({ widthCm, heightCm, depthCm }));
    }, [dispatch, productId]);

    const handleFaceChange = (selectedFace: Face): void => {
        dispatch(changeFace(selectedFace));
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
            <div style={{ display: 'flex' }}>
                <ControlPanel />
                <FabricBoxDesigner
                    faceWidthPx={faceDimensions[selectedFace].faceWidthPx + 20}
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
    );
}
