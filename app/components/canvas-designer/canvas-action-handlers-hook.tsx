import type { Face } from '@/features/canvas/models/face';
import type { FaceDesigns } from '@/features/canvas/models/face-design';
import * as fabric from 'fabric';
import { produce } from 'immer';
import { useCallback, type Dispatch, type SetStateAction } from 'react';

export type FaceChangeHandler = (selectedFace: Face) => void;
export type AddTextHandler = () => void;
export type AddImageHandler = (file: File) => void;
export type AddGoogleImageHandler = () => Promise<void>;
export type SaveCanvasHandler = () => void;

export const useCanvasActionsHandlers = (
    canvas: fabric.Canvas | null,
    faceDesigns: FaceDesigns,
    selectedFace: Face,
    setSelectedFace: Dispatch<SetStateAction<Face>>,
    setCurrentFaceDesignJson: Dispatch<SetStateAction<string>>,
    setFaceDesigns: Dispatch<SetStateAction<FaceDesigns>>,
): [
    FaceChangeHandler,
    AddTextHandler,
    AddImageHandler,
    AddGoogleImageHandler,
    SaveCanvasHandler,
] => {
    const faceChangeHandler = useCallback(
        (selectedFace: Face) => {
            setSelectedFace(selectedFace);
            setCurrentFaceDesignJson(faceDesigns[selectedFace].jsonDesign);
        },
        [faceDesigns, setCurrentFaceDesignJson, setSelectedFace],
    );

    const addTextHandler = useCallback(() => {
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
    }, [canvas]);

    const addImageHandler = useCallback(
        (file: File) => {
            if (!canvas) {
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = async (loadEvent): Promise<void> => {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                const imageDataUrl = loadEvent.target?.result?.toString();
                if (imageDataUrl) {
                    await addImageToCanvas(imageDataUrl, canvas);

                    // Reset file input to allow uploading the same file again if needed
                    // fileInputRef.current.value = '';
                }
            };
            fileReader.onerror = (error): void => {
                console.error('Error reading file:', error);
                alert('Failed to read image file.');
            };

            fileReader.readAsDataURL(file);
        },
        [canvas],
    );

    const addGoogleImageHandler = useCallback(async () => {
        if (!canvas) {
            return;
        }

        const logoImageURL = '../google-logo.png';
        await addImageToCanvas(logoImageURL, canvas);
    }, [canvas]);

    const saveCanvasDesignHandler = useCallback(() => {
        if (!canvas) {
            return;
        }

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
        const newJsonDesign = JSON.stringify(
            canvas.toObject(extraProperties) as unknown,
        );
        const newDataUrlTexture = canvas.toDataURL({
            format: 'png',
            multiplier: 1,
        });

        setFaceDesigns(
            produce((faceDesigns) => {
                faceDesigns[selectedFace].jsonDesign = newJsonDesign;
                faceDesigns[selectedFace].dataUrlTexture = newDataUrlTexture;
            }),
        );
    }, [canvas, selectedFace, setFaceDesigns]);

    return [
        faceChangeHandler,
        addTextHandler,
        addImageHandler,
        addGoogleImageHandler,
        saveCanvasDesignHandler,
    ];
};

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
    // canvas.requestRenderAll();
    canvas.renderAll();
}
