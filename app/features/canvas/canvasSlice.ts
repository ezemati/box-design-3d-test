import type { RootState } from '@/store/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
    getBoxDimensions,
    getInitialBoxDimensions,
    type BoxDimensions,
} from './models/box';
import type { Face } from './models/face';
import { getInitialFaceDesigns, type FaceDesigns } from './models/face-design';
import {
    getFaceDimensions,
    getInitialFaceDimensions,
    type FaceDimensions,
} from './models/face-dimensions';

export interface CanvasState {
    boxDimensions: BoxDimensions;
    currentFace: Face;
    faceDesigns: FaceDesigns;
    faceDimensions: FaceDimensions;
}

const initialState: CanvasState = {
    boxDimensions: getInitialBoxDimensions(),
    currentFace: 'top',
    faceDesigns: getInitialFaceDesigns(),
    faceDimensions: getInitialFaceDimensions(),
};

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        changeFace: (state, action: PayloadAction<Face>) => {
            state.currentFace = action.payload;
        },
        loadBoxDimensions: (
            state,
            action: PayloadAction<{
                widthCm: number;
                heightCm: number;
                depthCm: number;
            }>,
        ) => {
            const { widthCm, heightCm, depthCm } = action.payload;
            state.boxDimensions = getBoxDimensions(widthCm, heightCm, depthCm);
            state.faceDimensions = getFaceDimensions(
                widthCm,
                heightCm,
                depthCm,
            );
        },
        saveFaceDesignAsJson: (state, action: PayloadAction<string>) => {
            const currentFace = state.currentFace;
            state.faceDesigns[currentFace].jsonDesign = action.payload;
        },
        saveFaceDesignAsUrlTexture: (state, action: PayloadAction<string>) => {
            const currentFace = state.currentFace;
            state.faceDesigns[currentFace].dataUrlTexture = action.payload;
        },
    },
});

export const {
    changeFace,
    loadBoxDimensions,
    saveFaceDesignAsJson,
    saveFaceDesignAsUrlTexture,
} = canvasSlice.actions;

export const canvasReducer = canvasSlice.reducer;

export const selectCurrentFace = (state: RootState): Face =>
    state.canvas.currentFace;

export const selectBoxDimensions = (state: RootState): BoxDimensions =>
    state.canvas.boxDimensions;

export const selectFaceDesigns = (state: RootState): FaceDesigns =>
    state.canvas.faceDesigns;
