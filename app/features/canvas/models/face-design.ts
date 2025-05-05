import type { Face } from './face';

export interface FaceDesign {
    face: Face;
    jsonDesign: string;
    dataUrlTexture: string;
}

export type FaceDesigns = Record<Face, FaceDesign>;

export function getInitialFaceDesigns(): FaceDesigns {
    return {
        front: getInitialFaceDesign('front'),
        back: getInitialFaceDesign('back'),
        top: getInitialFaceDesign('top'),
        bottom: getInitialFaceDesign('bottom'),
        left: getInitialFaceDesign('left'),
        right: getInitialFaceDesign('right'),
    };
}

export function getInitialFaceDesign(face: Face): FaceDesign {
    return {
        face: face,
        jsonDesign: '',
        dataUrlTexture: '',
    };
}
