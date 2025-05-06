import { getBoxDimensions } from '@/features/canvas/models/box';
import { getFaceDimensions } from '@/features/canvas/models/face-dimensions';
import { Flex, Stack } from '@mantine/core';
import { useEffect, useRef, type JSX } from 'react';
import { CanvasActions } from '../control-panel/canvas-actions';
import { ControlPanel } from '../control-panel/control-panel';
import { BoxPreview3DWithFiberThreeReactCanvas } from '../threejs/box-preview-3d';
import { useCanvasActionsHandlers } from './canvas-action-handlers-hook';
import { useCanvasFabricEffects } from './canvas-effects-hook';
import { useCanvasFabricState } from './canvas-state-hook';
import { useControlPanelHandlers } from './control-panel-handlers-hook';

export interface DesignerContainerProps {
    productId: string;
}

export function DesignerContainer({
    productId,
}: DesignerContainerProps): JSX.Element {
    const [
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
    ] = useCanvasFabricState();

    const [
        handleFaceChange,
        handleAddText,
        handleAddImage,
        handleAddGoogleImage,
        handleSaveCanvas,
    ] = useCanvasActionsHandlers(
        canvasInstance,
        faceDesigns,
        selectedFace,
        setSelectedFace,
        setCurrentFaceDesignJson,
        setFaceDesigns,
    );

    useEffect(() => {
        // Read box ID from route, fetch box's dimensions from API
        const widthCm = 300;
        const heightCm = 200;
        const depthCm = 100;

        console.log(
            `Using dimensions (${widthCm.toString()}, ${heightCm.toString()}, ${depthCm.toString()}) for product with Id ${productId}`,
        );

        setBoxDimensions(getBoxDimensions(widthCm, heightCm, depthCm));
        setFaceDimensions(getFaceDimensions(widthCm, heightCm, depthCm));
    }, [productId, setBoxDimensions, setFaceDimensions]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useCanvasFabricEffects(
        canvasRef.current,
        canvasInstance,
        selectedFace,
        currentFaceDesignJson,
        faceDimensions[selectedFace].faceWidthPx + 20,
        faceDimensions[selectedFace].faceHeightPx + 20,
        setActiveObjects,
        setCanvasInstance,
        handleSaveCanvas,
    );

    const [handleBoldClick, handleItalicClick, handleUnderlineClick] =
        useControlPanelHandlers(canvasInstance);

    return (
        <Flex
            mih={50}
            gap="md"
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="wrap"
        >
            <CanvasActions
                selectedFace={selectedFace}
                onFaceChange={handleFaceChange}
                onAddTextClick={handleAddText}
                onAddImageClick={handleAddImage}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onAddGoogleImageClick={handleAddGoogleImage}
                onSaveClick={handleSaveCanvas}
            />

            <Stack>
                <ControlPanel
                    activeObjects={activeObjects}
                    onBoldClick={handleBoldClick}
                    onItalicClick={handleItalicClick}
                    onUnderlineClick={handleUnderlineClick}
                />
                <canvas
                    ref={canvasRef}
                    style={{ height: '100%', width: '100%' }}
                />
                {/* <FabricBoxDesigner
                    currentFaceDesign={currentFaceDesignJson}
                    faceWidthPx={faceDimensions[selectedFace].faceWidthPx + 20}
                    faceHeightPx={
                        faceDimensions[selectedFace].faceHeightPx + 20
                        }
                        onCanvasCreation={setFabricCanvas}
                        /> */}
            </Stack>

            <BoxPreview3DWithFiberThreeReactCanvas
                faceDesigns={faceDesigns}
                widthCm={boxDimensions.widthCm}
                heightCm={boxDimensions.heightCm}
                depthCm={boxDimensions.depthCm}
            />
        </Flex>
    );
}
