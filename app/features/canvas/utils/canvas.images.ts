import * as fabric from 'fabric';

export async function addImageToCanvas(
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
