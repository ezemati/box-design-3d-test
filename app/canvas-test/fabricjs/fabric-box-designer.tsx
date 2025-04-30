import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export type FabricBoxDesignerProps = {
    // boxImageUrl: string;
    face: string;
    faceWidthPx: number;
    faceHeightPx: number;

    onChange: (jsonDesign: string, dataUrlTexture: string) => void;
    faceDesignJson: string;
};

function fabricBoxDesigner({
    // boxImageUrl,
    face,
    faceWidthPx,
    faceHeightPx,
    onChange,
    faceDesignJson,
}: FabricBoxDesignerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    const [canvas, setCanvas] = useState<fabric.Canvas>(null!);

    useEffect(() => {
        console.log(`Setting up face '${face}'`);

        const options: Partial<fabric.CanvasOptions> = {
            width: faceWidthPx,
            height: faceHeightPx,
            backgroundColor: "#fff",
            selection: true,
        };
        const canvas = new fabric.Canvas(canvasRef.current, options);
        setCanvas(canvas);

        if (faceDesignJson !== "") {
            canvas.loadFromJSON(faceDesignJson).then(() => {
                canvas.requestRenderAll();
                console.log(`Canvas for face '${face}' loaded from JSON`)
            });
        } else {
            const drawBoxFace = () => {
                const faceRect = new fabric.Rect({
                    height: faceHeightPx - 20,
                    width: faceWidthPx - 20,
                    fill: "#fcf51c",
                    borderColor: "#000",
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

        // Save design as JSON every 1 second
        const interval = setInterval(() => {
            // handleSaveDesignClick();
        }, 1000);

        return () => {
            clearInterval(interval);
            canvas.removeListeners();
            canvas.dispose();
        }
    }, [faceWidthPx, faceHeightPx, faceDesignJson, onChange, face]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            console.log({ e });
            if (key !== "Delete") {
                return;
            }

            const selectedObjects = canvas.getActiveObjects();
            console.log(`Removing ${selectedObjects.length} objects...`)
            selectedObjects.forEach((obj) => {
                canvas.remove(obj);
            });
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas]);

    const handleAddImageClick = async () => {
        const logoImageURL = "./google-logo.png";
        const img = await fabric.FabricImage.fromURL(logoImageURL, {}, {
            left: 150,
            top: 100,
            angle: 0,
            scaleX: 0.5,
            scaleY: 0.5,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
    }

    const handleSaveDesignClick = () => {
        const extraProperties = [
            "height",
            "width",
            "fill",
            "borderColor",
            "selectable",
            "left",
            "top",
            "hasControls",
        ];
        const newJsonDesign = canvas.toObject(extraProperties);
        const newDataUrlTexture = canvas.toDataURL({ format: "png", multiplier: 1 });
        onChange(JSON.stringify(newJsonDesign), newDataUrlTexture);
    }

    return (
        <div>
            <canvas ref={canvasRef} style={{ height: "100%", width: "100%" }} />
            <button onClick={handleAddImageClick}>Add Image</button>
            <button style={{ marginLeft: "10px" }} onClick={handleSaveDesignClick}>Save</button>
        </div>
    );
};

export const FabricBoxDesigner = React.memo(fabricBoxDesigner);
