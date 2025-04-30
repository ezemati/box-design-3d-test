import type { Face } from "../face.model";

// To set the correct "material-{index}" value for the `attach` property
export function faceToThreeJsIndex(face: Face) {
    const threeJsOrder: Face[] = ["right", "left", "top", "bottom", "front", "back"];
    const threeJsIndex = threeJsOrder.indexOf(face);
    return threeJsIndex;
}
