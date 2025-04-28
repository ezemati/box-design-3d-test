import { FabricBoxDesigner } from "./fabric-box-designer";

export type CanvasTestProps = {};

export default function CanvasTest({}: CanvasTestProps) {
    const backgroundImageURL = "./box-image.jpg";

    return (
        <FabricBoxDesigner boxImageUrl={backgroundImageURL} />
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
