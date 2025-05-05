import * as fabric from 'fabric';

export function setBoldToActiveObjects(
    canvas: fabric.Canvas | null,
    setBold: boolean,
): void {
    setPropertyToActiveTextObjects(
        canvas,
        'fontWeight',
        setBold ? 'bold' : 'normal',
    );
}

export function setItalicToActiveObjects(
    canvas: fabric.Canvas | null,
    setItalic: boolean,
): void {
    setPropertyToActiveTextObjects(
        canvas,
        'fontStyle',
        setItalic ? 'italic' : 'normal',
    );
}

export function setUnderlineToActiveObjects(
    canvas: fabric.Canvas | null,
    setUnderline: boolean,
): void {
    setPropertyToActiveTextObjects(canvas, 'underline', setUnderline);
}

export function setPropertyToActiveTextObjects(
    canvas: fabric.Canvas | null,
    propertyName: string,
    propertyValue: unknown,
): void {
    if (!canvas) {
        return;
    }

    canvas
        .getActiveObjects()
        .filter((obj) => obj.isType('IText', 'Textbox'))
        .map((obj) => obj as fabric.IText)
        .forEach((text) => {
            text.set(propertyName, propertyValue);
            // text.setCoords();
        });

    canvas.requestRenderAll();
}
