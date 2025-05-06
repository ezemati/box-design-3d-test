import * as fabric from 'fabric';
import { useCallback } from 'react';

export type BoldClickHandler = (setBold: boolean) => void;
export type ItalicClickHandler = (setItalic: boolean) => void;
export type UnderlineClickHandler = (setUnderline: boolean) => void;

export const useControlPanelHandlers = (
    canvas: fabric.Canvas | null,
): [BoldClickHandler, ItalicClickHandler, UnderlineClickHandler] => {
    const handleBoldClick = useCallback(
        (setBold: boolean): void => {
            setPropertyToActiveTextObjects(
                canvas,
                'fontWeight',
                setBold ? 'bold' : 'normal',
            );
        },
        [canvas],
    );

    const handleItalicClick = useCallback(
        (setItalic: boolean): void => {
            setPropertyToActiveTextObjects(
                canvas,
                'fontStyle',
                setItalic ? 'italic' : 'normal',
            );
        },
        [canvas],
    );

    const handleUnderlineClick = useCallback(
        (setUnderline: boolean): void => {
            setPropertyToActiveTextObjects(canvas, 'underline', setUnderline);
        },
        [canvas],
    );

    return [handleBoldClick, handleItalicClick, handleUnderlineClick];
};

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

    // canvas.requestRenderAll();
    canvas.renderAll();
}
