import { ActionIcon, Group } from '@mantine/core';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react';
import * as fabric from 'fabric';
import { useEffect, useState, type JSX } from 'react';

export interface ControlPanelProps {
    activeObjects: fabric.FabricObject[];
    onBoldClick: (setBold: boolean) => void;
    onItalicClick: (setItalic: boolean) => void;
    onUnderlineClick: (setUnderline: boolean) => void;
}

export function ControlPanel({
    activeObjects,
    onBoldClick,
    onItalicClick,
    onUnderlineClick,
}: ControlPanelProps): JSX.Element {
    const [showBoldAsClicked, setShowBoldAsClicked] = useState(false);
    const [showItalicAsClicked, setShowItalicAsClicked] = useState(false);
    const [showUnderlineAsClicked, setShowUnderlineAsClicked] = useState(false);

    useEffect(() => {
        const textObjects = activeObjects
            .filter((obj) => obj.isType('IText', 'Textbox'))
            .map((obj) => obj as fabric.IText);

        const everyTextIsBold =
            textObjects.length > 0 &&
            textObjects.every((text) => text.fontWeight === 'bold');
        setShowBoldAsClicked(everyTextIsBold);

        const everyTextIsItalic =
            textObjects.length > 0 &&
            textObjects.every((text) => text.fontStyle === 'italic');
        setShowItalicAsClicked(everyTextIsItalic);

        const everyTextIsUnderline =
            textObjects.length > 0 &&
            textObjects.every((text) => text.underline);
        setShowUnderlineAsClicked(everyTextIsUnderline);
    }, [activeObjects]);

    const handleBoldButtonClick = (): void => {
        setShowBoldAsClicked((showAsClicked) => !showAsClicked);
        onBoldClick(!showBoldAsClicked);
    };

    const handleItalicButtonClick = (): void => {
        setShowItalicAsClicked((showAsClicked) => !showAsClicked);
        onItalicClick(!showItalicAsClicked);
    };

    const handleUnderlineButtonClick = (): void => {
        setShowUnderlineAsClicked((showAsClicked) => !showAsClicked);
        onUnderlineClick(!showUnderlineAsClicked);
    };

    return (
        <Group
            justify="center"
            style={(theme) => ({
                border: `1px solid ${theme.colors.gray[6]}`,
                borderRadius: theme.radius.md,
            })}
            py={3}
        >
            <ActionIcon.Group>
                <ActionIcon
                    variant={showBoldAsClicked ? 'filled' : 'default'}
                    onClick={handleBoldButtonClick}
                >
                    {/* <IconPhoto size={20} stroke={1.5} /> */}
                    <IconBold stroke={2} />
                </ActionIcon>
                <ActionIcon
                    variant={showItalicAsClicked ? 'filled' : 'default'}
                    onClick={handleItalicButtonClick}
                >
                    {/* <IconSettings size={20} stroke={1.5} /> */}
                    <IconItalic stroke={2} />
                </ActionIcon>
                <ActionIcon
                    variant={showUnderlineAsClicked ? 'filled' : 'default'}
                    onClick={handleUnderlineButtonClick}
                >
                    {/* <IconHeart size={20} stroke={1.5} /> */}
                    <IconUnderline stroke={2} />
                </ActionIcon>
            </ActionIcon.Group>
        </Group>
    );
}
