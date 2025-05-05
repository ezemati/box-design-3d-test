// import type { PayloadAction } from '@reduxjs/toolkit';
// import { createSlice } from '@reduxjs/toolkit';
// import * as fabric from 'fabric';
// import {
//     getBoxDimensions,
//     getInitialBoxDimensions,
//     type BoxDimensions,
// } from './models/box';
// import type { Face } from './models/face';
// import { getInitialFaceDesigns, type FaceDesigns } from './models/face-design';
// import {
//     getFaceDimensions,
//     getInitialFaceDimensions,
//     type FaceDimensions,
// } from './models/face-dimensions';

// export const canvasSlice = createSlice({
//     reducers: {
//         changeFace: (state, action: PayloadAction<Face>) => {
//             state.currentFace = action.payload;
//         },
//         loadBoxDimensions: (
//             state,
//             action: PayloadAction<{
//                 widthCm: number;
//                 heightCm: number;
//                 depthCm: number;
//             }>,
//         ) => {
//             const { widthCm, heightCm, depthCm } = action.payload;
//             state.boxDimensions = getBoxDimensions(widthCm, heightCm, depthCm);
//             state.faceDimensions = getFaceDimensions(
//                 widthCm,
//                 heightCm,
//                 depthCm,
//             );
//         },
//         setCanvasInstance: (
//             state,
//             action: PayloadAction<fabric.Canvas | null>,
//         ) => {
//             return {
//                 ...state,
//                 canvas: action.payload,
//             };
//         },
//         saveCanvasDesign: (state) => {
//             const { canvas, currentFace } = state;

//             if (!canvas) {
//                 return;
//             }

//             const extraProperties = [
//                 'height',
//                 'width',
//                 'fill',
//                 'borderColor',
//                 'selectable',
//                 'left',
//                 'top',
//                 'hasControls',
//             ];
//             const newJsonDesign = canvas.toObject(extraProperties) as unknown;
//             state.faceDesigns[currentFace].jsonDesign =
//                 JSON.stringify(newJsonDesign);

//             const newDataUrlTexture = canvas.toDataURL({
//                 format: 'png',
//                 multiplier: 1,
//             });
//             state.faceDesigns[currentFace].dataUrlTexture = newDataUrlTexture;
//         },
//         setBoldText: (state, action: PayloadAction<boolean>) => {

//         },
//     },
// });

// export const {
//     changeFace,
//     loadBoxDimensions,
//     saveCanvasDesign,
//     setBoldText,
//     setCanvasInstance,
// } = canvasSlice.actions;

// export const canvasReducer = canvasSlice.reducer;
