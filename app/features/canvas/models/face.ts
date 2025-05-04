const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'] as const;

export type Face = (typeof faces)[number];

export function getAllFaces(): readonly Face[] {
    return faces;
}
