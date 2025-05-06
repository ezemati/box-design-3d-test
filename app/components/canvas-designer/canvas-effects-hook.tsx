import type { Face } from '@/features/canvas/models/face';
import * as fabric from 'fabric';
import { useEffect } from 'react';

export const useCanvasFabricEffects = (
    canvasEl: HTMLCanvasElement | null,
    canvasInstance: fabric.Canvas | null,
    currentFace: Face,
    currentFaceDesignJson: string,
    faceWidthPx: number,
    faceHeightPx: number,
    setActiveObjects: (activeObjects: fabric.FabricObject[]) => void,
    setCanvasInstance: (canvas: fabric.Canvas) => void,
    saveCanvasDesign: () => void,
): void => {
    // Create new Fabric Canvas instance on every face change
    useEffect(() => {
        if (!canvasEl) {
            return;
        }

        console.log(`Creating canvas for face ${currentFace}`);

        const options: Partial<fabric.CanvasOptions> = {
            width: faceWidthPx,
            height: faceHeightPx,
            // backgroundColor: '#fff',
            backgroundColor: '#dce6bc',
            selection: true,
        };
        const newCanvas = new fabric.Canvas(canvasEl, options);
        setCanvasInstance(newCanvas);

        return (): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            newCanvas.dispose();
        };
    }, [canvasEl, currentFace, faceHeightPx, faceWidthPx, setCanvasInstance]);

    // Save canvas design periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (canvasInstance) {
                console.log('Saving...');
                saveCanvasDesign();
            }
        }, 3000);

        return (): void => {
            clearInterval(interval);
        };
    }, [canvasInstance, saveCanvasDesign]);

    // Set up initial canvas design (create new background rect or load from JSON)
    useEffect(() => {
        if (!canvasInstance || canvasInstance.disposed) {
            return;
        }

        console.log(`Setting up canvas for face '${currentFace}'`);

        // Delete elements from previous face's canvas
        // (maybe it's more convenient to create a new Canvas on currentFace change)
        // const objects = canvasInstance.getObjects();
        // canvasInstance.remove(...objects);

        if (currentFaceDesignJson !== '') {
            const loadDesignFromJson = async (): Promise<void> => {
                await canvasInstance.loadFromJSON(currentFaceDesignJson);
                // canvasInstance.requestRenderAll();
                canvasInstance.renderAll();
                console.log(
                    `Canvas for face '${currentFace}' loaded from JSON`,
                );
            };
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            loadDesignFromJson();
        } else {
            const drawBoxFace = (): void => {
                const faceRect = new fabric.Rect({
                    height: faceHeightPx - 20,
                    width: faceWidthPx - 20,
                    fill: '#fcf51c',
                    borderColor: '#000',
                    selectable: false,
                    left: 20 / 2,
                    top: 20 / 2,
                    hasControls: false,
                });

                // canvas.backgroundImage = img;
                canvasInstance.add(faceRect);

                // canvasInstance.requestRenderAll();
                canvasInstance.renderAll();

                console.log(
                    `Canvas for face '${currentFace}' created from scratch`,
                );
                saveCanvasDesign();
            };
            drawBoxFace();
        }
    }, [
        canvasInstance,
        currentFace,
        currentFaceDesignJson,
        faceHeightPx,
        faceWidthPx,
        saveCanvasDesign,
    ]);

    // Set up listeners to save the canvas on every modification
    useEffect(() => {
        if (!canvasInstance || canvasInstance.disposed) {
            return;
        }

        const eventsToRerender: (keyof fabric.CanvasEvents)[] = [
            'object:added',
            'object:modified',
            'object:removed',
        ];

        const disposeFunctions = eventsToRerender.map((event) => {
            const dispose = canvasInstance.on(event, () => {
                console.log(event);
                // saveCanvasDesign();
            });
            return dispose;
        });

        return (): void => {
            disposeFunctions.forEach((dispose) => {
                dispose();
            });
        };
    }, [canvasInstance, saveCanvasDesign]);

    // Set up listeners to update the Active Objects on every selection change
    useEffect(() => {
        if (!canvasInstance || canvasInstance.disposed) {
            return;
        }

        const eventsToUpdateSelection: (keyof fabric.CanvasEvents)[] = [
            'selection:created',
            'selection:updated',
            'selection:cleared',
            'text:selection:changed',
        ];

        const disposeFunctions = eventsToUpdateSelection.map((event) => {
            const dispose = canvasInstance.on(event, () => {
                console.log(event);
                const activeObjects = canvasInstance.getActiveObjects();
                setActiveObjects(activeObjects);
            });
            return dispose;
        });

        return (): void => {
            disposeFunctions.forEach((dispose) => {
                dispose();
            });
        };
    }, [canvasInstance, setActiveObjects]);

    // Set up window listener to remove Active Objects on Delete key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!canvasInstance || canvasInstance.disposed) {
                return;
            }

            const key = e.key;
            if (key !== 'Delete') {
                return;
            }

            const selectedObjects = canvasInstance.getActiveObjects();
            console.log(
                `Removing ${selectedObjects.length.toString()} objects...`,
            );
            selectedObjects.forEach((obj) => {
                canvasInstance.remove(obj);
            });
            canvasInstance.discardActiveObject();
            // canvasInstance.requestRenderAll();
            canvasInstance.renderAll();
        };

        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvasInstance]);
};
