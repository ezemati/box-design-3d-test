import type { Face } from './face';

export interface FaceDesign {
    face: Face;
    jsonDesign: string;
    dataUrlTexture: string;
}

export type FaceDesigns = Record<Face, FaceDesign>;

export function getInitialFaceDesigns(): FaceDesigns {
    return {
        front: {
            face: 'front',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        back: {
            face: 'back',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        top: {
            face: 'top',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        bottom: {
            face: 'bottom',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        left: {
            face: 'left',
            jsonDesign: '',
            dataUrlTexture: '',
        },
        right: {
            face: 'right',
            jsonDesign: '',
            dataUrlTexture: '',
        },
    };
}
