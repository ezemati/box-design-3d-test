export interface BoxDimensions {
    widthCm: number;
    heightCm: number;
    depthCm: number;
}

export function newBoxDimensions(
    widthCm: number,
    heightCm: number,
    depthCm: number,
): BoxDimensions {
    return {
        widthCm,
        heightCm,
        depthCm,
    };
}
