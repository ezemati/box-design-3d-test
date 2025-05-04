export interface BoxDimensions {
    widthCm: number;
    heightCm: number;
    depthCm: number;
}

export function getInitialBoxDimensions(): BoxDimensions {
    return getBoxDimensions(0, 0, 0);
}

export function getBoxDimensions(
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
