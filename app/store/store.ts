import {
    getBoxDimensions,
    getInitialBoxDimensions,
    type BoxDimensions,
} from '@/features/canvas/models/box';
import type { Face } from '@/features/canvas/models/face';
import {
    getInitialFaceDesign,
    getInitialFaceDesigns,
    type FaceDesign,
    type FaceDesigns,
} from '@/features/canvas/models/face-design';
import {
    getFaceDimensions,
    getInitialFaceDimensions,
    type FaceDimensions,
} from '@/features/canvas/models/face-dimensions';
import * as fabric from 'fabric';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface CanvasState {
    boxDimensions: BoxDimensions;
    currentFace: Face;
    currentFaceDesign: FaceDesign;
    faceDesigns: FaceDesigns;
    faceDimensions: FaceDimensions;

    activeObjects: fabric.FabricObject[];

    boldButtonClickHandler: (setBold: boolean) => void;
    italicButtonClickHandler: (setItalic: boolean) => void;
    underlineButtonClickHandler: (setItalic: boolean) => void;
}

export interface CanvasActions {
    changeFace: (selectedFace: Face) => void;
    loadBoxDimensions: (
        widthCm: number,
        heightCm: number,
        depthCm: number,
    ) => void;
    saveCanvasDesign: (canvas: fabric.Canvas, face: Face) => void;
    setActiveObjects: (activeObjects: fabric.FabricObject[]) => void;
    setBoldButtonClickHandler: (handler: (setBold: boolean) => void) => void;
    setItalicButtonClickHandler: (
        handler: (setItalic: boolean) => void,
    ) => void;
    setUnderlineButtonClickHandler: (
        handler: (setUnderline: boolean) => void,
    ) => void;
}

export const useStore = create<CanvasState & CanvasActions>()(
    devtools(
        immer((set) => ({
            boxDimensions: getInitialBoxDimensions(),
            currentFace: 'front',
            currentFaceDesign: getInitialFaceDesign('front'),
            faceDesigns: getInitialFaceDesigns(),
            faceDimensions: getInitialFaceDimensions(),

            activeObjects: [],
            boldButtonClickHandler: (): void => {
                throw new Error(
                    "Bold button handler hasn't been assigned yet!",
                );
            },
            italicButtonClickHandler: (): void => {
                throw new Error(
                    "Italic button handler hasn't been assigned yet!",
                );
            },
            underlineButtonClickHandler: (): void => {
                throw new Error(
                    "Underline button handler hasn't been assigned yet!",
                );
            },

            changeFace: (selectedFace: Face): void => {
                set(
                    (state) => {
                        state.currentFace = selectedFace;
                        state.currentFaceDesign =
                            state.faceDesigns[selectedFace];
                    },
                    undefined,
                    'canvas/changeFace',
                );
            },

            loadBoxDimensions: (
                widthCm: number,
                heightCm: number,
                depthCm: number,
            ): void => {
                set(
                    (state) => {
                        state.boxDimensions = getBoxDimensions(
                            widthCm,
                            heightCm,
                            depthCm,
                        );
                        state.faceDimensions = getFaceDimensions(
                            widthCm,
                            heightCm,
                            depthCm,
                        );
                    },
                    undefined,
                    'canvas/loadBoxDimensions',
                );
            },

            saveCanvasDesign: (
                canvas: fabric.Canvas,
                currentFace: Face,
            ): void => {
                set(
                    (state) => {
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
                        state.faceDesigns[currentFace].jsonDesign =
                            newJsonDesign;

                        const newDataUrlTexture = canvas.toDataURL({
                            format: 'png',
                            multiplier: 1,
                        });
                        state.faceDesigns[currentFace].dataUrlTexture =
                            newDataUrlTexture;
                    },
                    undefined,
                    'canvas/saveCanvasDesign',
                );
            },

            setActiveObjects: (activeObjects): void => {
                set(
                    (state) => {
                        return {
                            ...state,
                            activeObjects,
                        };
                    },
                    undefined,
                    'canvas/setActiveObjects',
                );
            },

            setBoldButtonClickHandler: (handler): void => {
                set(
                    (state) => {
                        state.boldButtonClickHandler = handler;
                    },
                    undefined,
                    'canvas/setBoldButtonClickHandler',
                );
            },
            setItalicButtonClickHandler: (handler): void => {
                set(
                    (state) => {
                        state.italicButtonClickHandler = handler;
                    },
                    undefined,
                    'canvas/setItalicButtonClickHandler',
                );
            },
            setUnderlineButtonClickHandler: (handler): void => {
                set(
                    (state) => {
                        state.underlineButtonClickHandler = handler;
                    },
                    undefined,
                    'canvas/setUnderlineButtonClickHandler',
                );
            },
        })),
    ),
);
