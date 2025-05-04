import { DesignerContainer } from '@/components/canvas-designer/designer-container';
import type { JSX } from 'react';
import type { Route } from './+types/canvas-test';

export default function CanvasTest({
    params: { boxId },
}: Route.ComponentProps): JSX.Element {
    console.log({ boxId });

    return <DesignerContainer productId={boxId} />;

    // return (
    // <Stage
    //     // width={window.innerWidth}
    //     // height={window.innerHeight}
    //     width={backgroundImage.width}
    //     height={backgroundImage.height}
    //     onClick={handleStageClick}
    // >
    // </Stage>
    // );
}
