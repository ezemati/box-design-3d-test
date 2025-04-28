import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

export type FabricBoxDesignerProps = {
    boxImageUrl: string;
}

export function FabricBoxDesigner({ boxImageUrl }: FabricBoxDesignerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    let canvas: fabric.Canvas;

    useEffect(() => {
        const options: Partial<fabric.CanvasOptions> = {
            width: 600,
            height: 400,
            backgroundColor: "#fff",
            selection: true,
        };
        canvas = new fabric.Canvas(canvasRef.current, options);

        const setBoxAsBackgroundImage = async () => {
            const img = await fabric.FabricImage.fromURL(boxImageUrl);
            // canvas.width = img.width;
            // canvas.height = img.height;
            img.scaleX = canvas.width / img.width;
            img.scaleY = canvas.height / img.height;
            img.selectable = false;

            canvas.backgroundImage = img;

            // const renderAll = canvas.renderAll.bind(canvas);
            // renderAll();
            canvas.requestRenderAll();
        };
        setBoxAsBackgroundImage();

        return () => {
            canvas.dispose();
        }
    }, [boxImageUrl]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
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

    }, []);

    const handleAddImageClick = () => {
        const logoImageURL = "./google-logo.png";
        fabric.FabricImage.fromURL(logoImageURL, {}, {
            left: 150,
            top: 100,
            angle: 0,
            scaleX: 0.5,
            scaleY: 0.5,
        }).then((img) => {
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
        });
    }

    return (
        <div>
            <canvas ref={canvasRef} width="300" height="300" />
            <button onClick={handleAddImageClick}>Add Image</button>
        </div>
    );
};
