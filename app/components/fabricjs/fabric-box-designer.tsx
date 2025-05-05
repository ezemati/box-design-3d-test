import {
    setBoldToActiveObjects,
    setItalicToActiveObjects,
    setUnderlineToActiveObjects,
} from '@/features/canvas/utils/canvas-text-styling';
import { addImageToCanvas } from '@/features/canvas/utils/canvas.images';
import { useStore } from '@/store/store';
import * as fabric from 'fabric';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    type JSX,
} from 'react';

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

    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const currentFace = useStore((state) => state.currentFace);
    const currentFaceDesign = useStore((state) => state.currentFaceDesign);

    const saveCanvasDesign = useStore((state) => state.saveCanvasDesign);
    const setActiveObjects = useStore((state) => state.setActiveObjects);
    const [
        setBoldButtonClickHandler,
        setItalicButtonClickHandler,
        setUnderlineButtonClickHandler,
    ] = useSetBoldItalicUnderlineButtonClickHandlers();

    useEffect(() => {
        const options: Partial<fabric.CanvasOptions> = {
            width: faceWidthPx,
            height: faceHeightPx,
            // backgroundColor: '#fff',
            backgroundColor: '#dce6bc',
            selection: true,
        };
        const newCanvas = new fabric.Canvas(canvasRef.current, options);
        setCanvas(newCanvas);

        return (): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            newCanvas.dispose();
        };
    }, [faceHeightPx, faceWidthPx]);

    const handleSaveDesignClick = (): void => {
        if (canvas) {
            saveCanvasDesign(canvas, currentFace);
        }
    };

    const [
        handleBoldButtonClick,
        handleItalicButtonClick,
        handleUnderlineButtonClick,
    ] = useBoldItalicUnderlineCallbacks(canvas);

    useEffect(() => {
        setBoldButtonClickHandler(handleBoldButtonClick);
        setItalicButtonClickHandler(handleItalicButtonClick);
        setUnderlineButtonClickHandler(handleUnderlineButtonClick);
    }, [
        handleBoldButtonClick,
        handleItalicButtonClick,
        handleUnderlineButtonClick,
        setBoldButtonClickHandler,
        setItalicButtonClickHandler,
        setUnderlineButtonClickHandler,
    ]);

    useEffect(() => {
        // Save design as JSON periodically
        const interval = setInterval(() => {
            if (canvas) {
                // console.log('Saving...');
                // saveCanvasDesign(canvas, currentFace);
            }
        }, 3000);

        return (): void => {
            clearInterval(interval);
        };
    }, [canvas, currentFace, saveCanvasDesign]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        console.log(`Setting up canvas for face '${currentFace}'`);

        // Delete elements from previous face's canvas
        // (maybe it's more convenient to create a new Canvas on currentFace change)
        const objects = canvas.getObjects();
        canvas.remove(...objects);

        const currentFaceDesignJson = currentFaceDesign.jsonDesign;
        if (currentFaceDesignJson !== '') {
            const loadDesignFromJson = async (): Promise<void> => {
                await canvas.loadFromJSON(currentFaceDesignJson);
                canvas.requestRenderAll();
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
                canvas.add(faceRect);

                canvas.requestRenderAll();

                console.log(
                    `Canvas for face '${currentFace}' created from scratch`,
                );
                saveCanvasDesign(canvas, currentFace);
            };
            drawBoxFace();
        }
    }, [
        canvas,
        currentFace,
        currentFaceDesign.jsonDesign,
        faceHeightPx,
        faceWidthPx,
        saveCanvasDesign,
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
                saveCanvasDesign(canvas, currentFace);
            });
            return dispose;
        });

        return (): void => {
            disposeFunctions.forEach((dispose) => {
                dispose();
            });
        };
    }, [canvas, currentFace, saveCanvasDesign]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        const eventsToUpdateSelection: (keyof fabric.CanvasEvents)[] = [
            'selection:created',
            'selection:updated',
            'selection:cleared',
            'text:selection:changed',
        ];

        const disposeFunctions = eventsToUpdateSelection.map((event) => {
            const dispose = canvas.on(event, () => {
                console.log(event);
                const activeObjects = canvas.getActiveObjects();
                setActiveObjects(activeObjects);
            });
            return dispose;
        });

        return (): void => {
            disposeFunctions.forEach((dispose) => {
                dispose();
            });
        };
    }, [canvas, setActiveObjects]);

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
            saveCanvasDesign(canvas, currentFace);
        };

        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas, currentFace, saveCanvasDesign]);

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

        // const iText = new fabric.IText('IText object', {
        //     fontSize: 12,
        //     selectable: true,
        // });
        // canvas.add(iText);

        const textBox = new fabric.Textbox('TextBox object', {
            fontSize: 12,
            selectable: true,
        });
        canvas.add(textBox);
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

type TextStyleHandler = (setStyle: boolean) => void;
const useBoldItalicUnderlineCallbacks = (
    canvas: fabric.Canvas | null,
): [TextStyleHandler, TextStyleHandler, TextStyleHandler] => {
    const handleBoldButtonClick = useCallback(
        (setBold: boolean) => {
            setBoldToActiveObjects(canvas, setBold);
        },
        [canvas],
    );

    const handleItalicButtonClick = useCallback(
        (setItalic: boolean) => {
            setItalicToActiveObjects(canvas, setItalic);
        },
        [canvas],
    );

    const handleUnderlineButtonClick = useCallback(
        (setUnderline: boolean) => {
            setUnderlineToActiveObjects(canvas, setUnderline);
        },
        [canvas],
    );

    return [
        handleBoldButtonClick,
        handleItalicButtonClick,
        handleUnderlineButtonClick,
    ];
};

type SetTextStyleHandler = (handler: TextStyleHandler) => void;
const useSetBoldItalicUnderlineButtonClickHandlers = (): [
    SetTextStyleHandler,
    SetTextStyleHandler,
    SetTextStyleHandler,
] => {
    const setBoldButtonClickHandler = useStore(
        (state) => state.setBoldButtonClickHandler,
    );
    const setItalicButtonClickHandler = useStore(
        (state) => state.setItalicButtonClickHandler,
    );
    const setUnderlineButtonClickHandler = useStore(
        (state) => state.setUnderlineButtonClickHandler,
    );

    return [
        setBoldButtonClickHandler,
        setItalicButtonClickHandler,
        setUnderlineButtonClickHandler,
    ];
};
