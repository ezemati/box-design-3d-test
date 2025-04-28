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

        fabric.FabricImage.fromURL(boxImageUrl)
            .then((img) => {
                img.scaleX = canvas.width / img.width;
                img.scaleY = canvas.height / img.height;
                img.selectable = false;

                canvas.backgroundImage = img;

                // const renderAll = canvas.renderAll.bind(canvas);
                // renderAll();
                canvas.requestRenderAll();
            });

        return () => {
            canvas.dispose();
        }
    }, [boxImageUrl]);

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
