import { getAllFaces, type Face } from '@/features/canvas/models/face';
import { Button, FileButton, Group, Select, Stack } from '@mantine/core';
import { type JSX } from 'react';

const allFaces = getAllFaces();

export interface CanvasActionsProps {
    selectedFace: Face;
    onAddImageClick: (file: File) => void;
    onAddGoogleImageClick: () => void;
    onAddTextClick: () => void;
    onFaceChange: (selectedFace: Face) => void;
    onSaveClick: () => void;
}

export function CanvasActions({
    selectedFace,
    onAddGoogleImageClick,
    onAddImageClick,
    onAddTextClick,
    onFaceChange,
    onSaveClick,
}: CanvasActionsProps): JSX.Element {
    const handleUploadFile = (file: File | null): void => {
        if (file) {
            onAddImageClick(file);
        }
    };

    const handleFaceChange = (selectedFace: Face): void => {
        onFaceChange(selectedFace);
    };

    return (
        <Stack
            h={'80vh'}
            bg="var(--mantine-color-body)"
            align="center"
            justify="flex-start"
            gap="md"
        >
            <Select
                variant="filled"
                label="Face"
                placeholder="Select a face"
                data={allFaces}
                value={selectedFace}
                onChange={(face) => {
                    handleFaceChange(face as Face);
                }}
            />

            {/* Is this Group element needed? */}
            <Group justify="center">
                <FileButton
                    onChange={handleUploadFile}
                    accept="image/png,image/jpeg"
                >
                    {(props) => <Button {...props}>Add image</Button>}
                </FileButton>
            </Group>

            <Button variant="filled" onClick={onAddGoogleImageClick}>
                Add Google Image
            </Button>

            <Button variant="filled" onClick={onAddTextClick}>
                Add Text
            </Button>

            <Button variant="filled" color="green" onClick={onSaveClick}>
                Save
            </Button>
        </Stack>
    );
}
