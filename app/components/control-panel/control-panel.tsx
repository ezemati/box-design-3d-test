import { useStore } from '@/store/store';
import * as fabric from 'fabric';
import { useEffect, useState, type JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ControlPanelProps {}

// eslint-disable-next-line no-empty-pattern
export function ControlPanel({}: ControlPanelProps): JSX.Element {
    const activeObjects = useStore((state) => state.activeObjects);
    const boldClickHandler = useStore((state) => state.boldButtonClickHandler);
    const italicClickHandler = useStore(
        (state) => state.italicButtonClickHandler,
    );
    const underlineClickHandler = useStore(
        (state) => state.underlineButtonClickHandler,
    );

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
        boldClickHandler(!showBoldAsClicked);
        setShowBoldAsClicked((showAsClicked) => !showAsClicked);
    };

    const handleItalicButtonClick = (): void => {
        italicClickHandler(!showItalicAsClicked);
        setShowItalicAsClicked((showAsClicked) => !showAsClicked);
    };

    const handleUnderlineButtonClick = (): void => {
        underlineClickHandler(!showUnderlineAsClicked);
        setShowUnderlineAsClicked((showAsClicked) => !showAsClicked);
    };

    return (
        <div style={{ display: 'flex' }}>
            <button
                style={{
                    backgroundColor: showBoldAsClicked ? 'gray' : 'white',
                    flexGrow: 1,
                }}
                onClick={handleBoldButtonClick}
            >
                Bold
            </button>
            <button
                style={{
                    backgroundColor: showItalicAsClicked ? 'gray' : 'white',
                    flexGrow: 1,
                }}
                onClick={handleItalicButtonClick}
            >
                Italic
            </button>
            <button
                style={{
                    backgroundColor: showUnderlineAsClicked ? 'gray' : 'white',
                    flexGrow: 1,
                }}
                onClick={handleUnderlineButtonClick}
            >
                Underline
            </button>
        </div>
    );
}
