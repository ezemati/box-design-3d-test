import type { JSX } from 'react';
import { DesignerContainer } from './designer-container';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CanvasTestProps {}

export default function CanvasTest(props: CanvasTestProps): JSX.Element {
    console.log({ props });

    return <DesignerContainer productId="1" />;

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
