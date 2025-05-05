import { useAppDispatch, useAppSelector } from '@/store/hooks';
import * as fabric from 'fabric';
import { useEffect, useState, type JSX } from 'react';

import { setBoldText } from '@/features/canvas/canvasSlice';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ControlPanelProps {}

// eslint-disable-next-line no-empty-pattern
export function ControlPanel({}: ControlPanelProps): JSX.Element {
    const canvas = useAppSelector((state) => state.canvas.canvas);
    const dispatch = useAppDispatch();

    const [showBoldAsClicked, setShowBoldAsClicked] = useState(false);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        const dispose = canvas.on('selection:updated', (e) => {
            const selectedTexts = e.selected
                .filter((obj) => obj.isType('IText'))
                .map((obj) => obj as fabric.IText);
            const allTextsAreBold = selectedTexts.every(
                (obj) => obj.fontWeight === 'bold',
            );
            setShowBoldAsClicked(allTextsAreBold);
        });

        return dispose;
    }, [canvas]);

    const handleBoldButtonClick = (): void => {
        dispatch(setBoldText(!showBoldAsClicked));
    };

    return (
        <div style={{ display: 'flex' }}>
            <button
                style={{
                    backgroundColor: showBoldAsClicked ? 'gray' : 'white',
                }}
                onClick={handleBoldButtonClick}
            >
                Bold
            </button>
        </div>
    );
}
