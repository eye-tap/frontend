import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    boundingBoxColor,
    boundingBoxStrokeWidth,
    boundingBoxesOpacity,
    boxesDisplay,
    highlightedBoundingBoxColor,
    hoveredTextColor,
    proximityBoundingBoxColor
} from '../config';
import {
    boundingBoxes,
    canvasSize,
    zoomFactor
} from '../data';
import {
    computeOffset,
    scale,
    scalingFactor
} from './scaling';
import {
    imgDataToImageObject,
    setImageTextColour
} from './image-magic';
import type {
    EditorCharacterBoundingBox
} from '../types/boxes';

export const boxesRenderer = ( boxesCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
        ctx.lineWidth = scale( boundingBoxStrokeWidth.value );
        ctx.globalAlpha = boundingBoxesOpacity.value;

        if ( boxesDisplay.value === 'always' ) {
            boundingBoxes.value.forEach( normalModeRendering( ctx ) );
        } else if ( boxesDisplay.value === 'proximity' ) {
            boundingBoxes.value.forEach( proximityModeRendering( ctx ) );
        } else if ( boxesDisplay.value === 'letters' ) {
            boundingBoxes.value.forEach( letteredModeRendering( ctx, image ) );
        } else if ( boxesDisplay.value === 'hovered' ) {
            boundingBoxes.value.forEach( bb => {
                if ( bb.highlightClass === 'hovered' ) {
                    // Draw box
                    drawBox( highlightedBoundingBoxColor.value, bb, ctx! );
                } else if ( bb.highlightClass === 'highlight' ) {
                    // Draw box in highlight colors
                    drawBox( highlightedBoundingBoxColor.value, bb, ctx! );
                }
            } );
        } else if ( boxesDisplay.value === 'never' ) {
            // If 'never', obviously don't render anything, except for highlightClass 'highlight'
            boundingBoxes.value.forEach( bb => {
                if ( bb.highlightClass === 'highlight' ) {
                    // Draw box
                    drawBox( highlightedBoundingBoxColor.value, bb, ctx! );
                }
            } );
        }
    };

    onMounted( () => {
        ctx = boxesCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( [
        highlightedBoundingBoxColor,
        proximityBoundingBoxColor,
        boundingBoxColor,
        boundingBoxStrokeWidth,
        boundingBoxesOpacity,
        boxesDisplay,
        scalingFactor,
        zoomFactor
    ], render );

    return {
        render
    };
};

const drawBox = ( col: string, bb: EditorCharacterBoundingBox, ctx: CanvasRenderingContext2D ) => {
    ctx.strokeStyle = col;
    ctx.strokeRect(
        scale( bb.xMin! - computeOffset( 'x' ) ),
        scale( bb.yMin! - computeOffset( 'y' ) ),
        scale( bb.xMax! - bb.xMin! ),
        scale( bb.yMax! - bb.yMin! )
    );
};

const letteredModeRendering = ( ctx: CanvasRenderingContext2D, image: HTMLImageElement ) => {
    return ( bb: EditorCharacterBoundingBox ) => {
        if ( bb.highlightClass === 'hovered' ) {
            const w = Math.abs( bb.xMax! - bb.xMin! );
            const h = Math.abs( bb.yMax! - bb.yMin! );
            const imgData = setImageTextColour( image, hoveredTextColor.value, {
                'x': bb.xMin! - computeOffset( 'x' ),
                'y': bb.yMin! - computeOffset( 'y' ),
                'width': w,
                'height': h,
                'scale': true
            } );


            ( async () => {
                const img = await imgDataToImageObject( imgData, w, h );

                ctx.fillStyle = 'white';
                ctx.fillRect(
                    scale( bb.xMin! - 2 - computeOffset( 'x' ) ),
                    scale( bb.yMin! - 2 - computeOffset( 'y' ) ),
                    scale( w + 4 ),
                    scale( h + 4 )
                );
                ctx.drawImage(
                    img!,
                    scale( bb.xMin! - computeOffset( 'x' ) ),
                    scale( bb.yMin! - computeOffset( 'y' ) )
                );
            } )();
        } else if ( bb.highlightClass === 'highlight' ) {
            // Always draws an outline
            drawBox( highlightedBoundingBoxColor.value, bb, ctx );

            return;
        }
    };
};

const proximityModeRendering = ( ctx: CanvasRenderingContext2D ) => {
    return ( bb: EditorCharacterBoundingBox ) => {
        if ( bb.highlightClass === 'hovered' ) {
            // Highlight hovered box
            drawBox( highlightedBoundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'nearby' ) {
            // Nearby box highlighting
            drawBox( proximityBoundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'proximity' ) {
            // Box in proximity, uses default style
            drawBox( boundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'highlight' ) {
            // Always draws an outline
            drawBox( highlightedBoundingBoxColor.value, bb, ctx );
        }
    };
};

const normalModeRendering = ( ctx: CanvasRenderingContext2D ) => {
    return ( bb: EditorCharacterBoundingBox ) => {
        if ( bb.highlightClass === 'none' ) {
            // No special highlighting (uses default theme), except if proximity mode, then will not be rendered
            drawBox( boundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'hovered' ) {
            // Highlight hovered box
            drawBox( highlightedBoundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'nearby' ) {
            // Nearby box highlighting
            drawBox( proximityBoundingBoxColor.value, bb, ctx );
        } else if ( bb.highlightClass === 'highlight' ) {
            // Always draws an outline
            drawBox( highlightedBoundingBoxColor.value, bb, ctx );
        }
    };
};
