export type Face = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';

export function getAllFaces(): Face[] {
    return ['front', 'back', 'top', 'bottom', 'left', 'right'];
}

export interface FaceDimension {
    faceWidthPx: number;
    faceHeightPx: number;
}

export type FaceDimensions = Record<Face, FaceDimension>;

// const pxPerCm = 10 as const;
const pxPerCm = 3 as const;

export function getFaceDimensions(
    widthCm: number,
    heightCm: number,
    depthCm: number,
): FaceDimensions {
    return {
        front: {
            faceWidthPx: cmToPx(widthCm),
            faceHeightPx: cmToPx(heightCm),
        },
        back: {
            faceWidthPx: cmToPx(widthCm),
            faceHeightPx: cmToPx(heightCm),
        },
        top: {
            faceWidthPx: cmToPx(widthCm),
            faceHeightPx: cmToPx(depthCm),
        },
        bottom: {
            faceWidthPx: cmToPx(widthCm),
            faceHeightPx: cmToPx(depthCm),
        },
        left: {
            faceWidthPx: cmToPx(depthCm),
            faceHeightPx: cmToPx(heightCm),
        },
        right: {
            faceWidthPx: cmToPx(depthCm),
            faceHeightPx: cmToPx(heightCm),
        },
    };
}

export function cmToPx(cm: number): number {
    return cm * pxPerCm;
}

interface FaceDesign {
    face: Face;
    jsonDesign: string;
    dataUrlTexture: string;
}

export type FaceDesigns = Record<Face, FaceDesign>;
