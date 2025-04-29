import { DesignerContainer } from "./designer-container";

export type CanvasTestProps = {};

export default function CanvasTest({}: CanvasTestProps) {
    return (
        <DesignerContainer productId="1" />
    )

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
