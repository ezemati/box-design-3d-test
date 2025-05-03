import * as fabric from 'fabric';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    type JSX,
} from 'react';

export interface FabricBoxDesignerProps {
    // boxImageUrl: string;
    face: string;
    faceWidthPx: number;
    faceHeightPx: number;

    onChange: (jsonDesign: string, dataUrlTexture: string) => void;
    faceDesignJson: string;
}

function FabricBoxDesignerPrivate({
    // boxImageUrl,
    face,
    faceWidthPx,
    faceHeightPx,
    onChange,
    faceDesignJson,
}: FabricBoxDesignerProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    const handleSaveDesignClick = useCallback(() => {
        const extraProperties = [
            'height',
            'width',
            'fill',
            'borderColor',
            'selectable',
            'left',
            'top',
            'hasControls',
        ];

        if (!canvas) {
            return;
        }

        const newJsonDesign = canvas.toObject(extraProperties) as unknown;
        const newDataUrlTexture = canvas.toDataURL({
            format: 'png',
            multiplier: 1,
        });
        onChange(JSON.stringify(newJsonDesign), newDataUrlTexture);
    }, [canvas, onChange]);

    useEffect(() => {
        // Save design as JSON periodically
        const interval = setInterval(() => {
            console.log('Saving...');
            handleSaveDesignClick();
        }, 3000);

        return (): void => {
            clearInterval(interval);
        };
    }, [canvas, handleSaveDesignClick]);

    useEffect(() => {
        console.log(`Setting up face '${face}'`);

        const options: Partial<fabric.CanvasOptions> = {
            width: faceWidthPx,
            height: faceHeightPx,
            backgroundColor: '#fff',
            selection: true,
        };
        const canvas = new fabric.Canvas(canvasRef.current, options);
        setCanvas(canvas);

        if (faceDesignJson !== '') {
            const loadDesignFromJson = async (): Promise<void> => {
                await canvas.loadFromJSON(faceDesignJson);
                canvas.requestRenderAll();
                console.log(`Canvas for face '${face}' loaded from JSON`);
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
            };
            drawBoxFace();
        }

        // Save design as JSON after every change
        // canvas.on("after:render", () => {
        //     handleSaveDesignClick();
        // });

        return (): void => {
            canvas.removeListeners();

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            canvas.dispose();
        };
    }, [face, faceDesignJson, faceHeightPx, faceWidthPx]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!canvas) {
                return;
            }

            const key = e.key;
            console.log({ e });
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

    const handleAddImageClick = async (): Promise<void> => {
        if (!canvas) {
            return;
        }

        const logoImageURL = './google-logo.png';
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
    };

    return (
        <div>
            <canvas ref={canvasRef} style={{ height: '100%', width: '100%' }} />
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button onClick={handleAddImageClick}>Add Image</button>
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
