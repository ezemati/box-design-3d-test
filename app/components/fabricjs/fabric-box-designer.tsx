import {
    saveCanvasDesign,
    setCanvasInstance,
} from '@/features/canvas/canvasSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import * as fabric from 'fabric';
import React, { useCallback, useEffect, useRef, type JSX } from 'react';

export interface FabricBoxDesignerProps {
    faceWidthPx: number;
    faceHeightPx: number;
}

function FabricBoxDesignerPrivate({
    faceWidthPx,
    faceHeightPx,
}: FabricBoxDesignerProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fileInputRef = useRef<HTMLInputElement>(null!);

    const dispatch = useAppDispatch();
    const selectedFace = useAppSelector((state) => state.canvas.currentFace);
    const faceDesigns = useAppSelector((state) => state.canvas.faceDesigns);
    const canvas = useAppSelector((state) => state.canvas.canvas);

    const handleSaveDesignClick = useCallback(() => {
        dispatch(saveCanvasDesign());
    }, [dispatch]);

    useEffect(() => {
        // Save design as JSON periodically
        const interval = setInterval(() => {
            // console.log('Saving...');
            // handleSaveDesignClick();
        }, 3000);

        return (): void => {
            clearInterval(interval);
        };
    }, [handleSaveDesignClick]);

    useEffect(() => {
        if (canvas) {
            return;
        }

        const options: Partial<fabric.CanvasOptions> = {
            width: faceWidthPx,
            height: faceHeightPx,
            backgroundColor: '#fff',
            selection: true,
        };
        const newCanvas = new fabric.Canvas(canvasRef.current, options);
        dispatch(setCanvasInstance(newCanvas));

        return (): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            newCanvas.dispose();

            setCanvasInstance(null);
        };
    }, [canvas, dispatch, faceHeightPx, faceWidthPx]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        console.log(`Setting up canvas for face '${selectedFace}'`);

        const currentFaceDesignJson = faceDesigns[selectedFace].jsonDesign;
        if (currentFaceDesignJson !== '') {
            const loadDesignFromJson = async (): Promise<void> => {
                await canvas.loadFromJSON(currentFaceDesignJson);
                canvas.requestRenderAll();
                console.log(
                    `Canvas for face '${selectedFace}' loaded from JSON`,
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
                canvas.add(faceRect);

                // const renderAll = canvas.renderAll.bind(canvas);
                // renderAll();
                canvas.requestRenderAll();

                console.log(
                    `Canvas for face '${selectedFace}' created from scratch`,
                );
                dispatch(saveCanvasDesign());
            };
            drawBoxFace();
        }
    }, [
        canvas,
        dispatch,
        faceDesigns,
        faceHeightPx,
        faceWidthPx,
        selectedFace,
    ]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        const eventsToRerender: (keyof fabric.CanvasEvents)[] = [
            'object:added',
            'object:modified',
            'object:removed',
        ];

        const disposeFunctions = eventsToRerender.map((event) => {
            const dispose = canvas.on(event, () => {
                console.log(event);
                // dispatch(saveCanvasDesign());
            });
            return dispose;
        });

        return (): void => {
            disposeFunctions.forEach((dispose) => {
                dispose();
            });
        };
    }, [canvas, dispatch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!canvas) {
                return;
            }

            const key = e.key;
            if (key !== 'Delete') {
                return;
            }

            const selectedObjects = canvas.getActiveObjects();
            console.log(
                `Removing ${selectedObjects.length.toString()} objects...`,
            );
            selectedObjects.forEach((obj) => {
                canvas.remove(obj);
            });
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        };

        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas]);

    const handleAddImageClick = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        if (!canvas || !e.target.files) {
            return;
        }

        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = async (loadEvent): Promise<void> => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const imageDataUrl = loadEvent.target?.result?.toString();
            if (imageDataUrl) {
                await addImageToCanvas(imageDataUrl, canvas);

                // Reset file input to allow uploading the same file again if needed
                fileInputRef.current.value = '';
            }
        };
        fileReader.onerror = (error): void => {
            console.error('Error reading file:', error);
            alert('Failed to read image file.');
        };
        fileReader.readAsDataURL(file);
    };

    const handleAddGoogleImageClick = async (): Promise<void> => {
        if (!canvas) {
            return;
        }
        const logoImageURL = '../google-logo.png';
        await addImageToCanvas(logoImageURL, canvas);
    };

    const handleAddTextClick = (): void => {
        if (!canvas) {
            return;
        }

        const iText = new fabric.IText('Double click to edit!', {
            fontSize: 12,
            selectable: true,
        });
        canvas.add(iText);
    };

    return (
        <div>
            <canvas ref={canvasRef} style={{ height: '100%', width: '100%' }} />

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml" // Allow common image types
                ref={fileInputRef}
                onChange={handleAddImageClick}
                style={{ display: 'none' }}
            />

            <button
                onClick={() => {
                    fileInputRef.current.click();
                }}
            >
                Add Image
            </button>

            <button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleAddGoogleImageClick}
                style={{ marginLeft: '10px' }}
            >
                Add Google Image
            </button>

            <button onClick={handleAddTextClick} style={{ marginLeft: '10px' }}>
                Add Text
            </button>

            <button
                style={{ marginLeft: '10px' }}
                onClick={handleSaveDesignClick}
            >
                Save
            </button>
        </div>
    );
}

export const FabricBoxDesigner = React.memo(FabricBoxDesignerPrivate);

async function addImageToCanvas(
    logoImageURL: string,
    canvas: fabric.Canvas,
): Promise<void> {
    const img = await fabric.FabricImage.fromURL(
        logoImageURL,
        {},
        {
            left: 150,
            top: 100,
            angle: 0,
            scaleX: 0.5,
            scaleY: 0.5,
        },
    );
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
}
