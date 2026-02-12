import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    boundingBoxColor,
    boxesDisplay,
    highlightedBoundingBoxColor,
    proximityBoundingBoxColor
} from '../config';
import {
    boundingBoxes,
    canvasSize
} from '../data';
import type {
    EditorCharacterBoundingBox
} from '../types/boxes';
import {
    scale
} from '../util/scaling';

export const boxesRenderer = ( boxesCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    // TODO: For each renderer, determine if redraw is needed and only redraw the needed parts (if possible)
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
        // TODO: Add note somewhere that Canvas might look odd, simply tell user to allow usage of canvas in browser

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
                    return;
                } else if ( bb.highlightClass === 'highlight' ) {
                    // Draw box in highlight colors
                    return;
                }
            } );
        } else if ( boxesDisplay.value === 'never' ) {
            // If 'never', obviously don't render anything, except for highlightClass 'highlight'
            boundingBoxes.value.forEach( bb => {
                if ( bb.highlightClass === 'hovered' ) {
                    // Draw box
                    return;
                }
            } );
        }
    };

    onMounted( () => {
        ctx = boxesCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( boundingBoxes, render );

    return {
        render
    };
};

const drawBox = ( col: string, bb: EditorCharacterBoundingBox, ctx: CanvasRenderingContext2D ) => {
    ctx.strokeStyle = col;
    ctx.strokeRect( scale( bb.xMin! ), scale( bb.yMin! ), scale( bb.xMax! - bb.xMin! ), scale( bb.yMax! - bb.yMin! ) );
};

const letteredModeRendering = ( ctx: CanvasRenderingContext2D, image: HTMLImageElement ) => {
    return ( bb: EditorCharacterBoundingBox ) => {
        if ( bb.highlightClass === 'hovered' ) {
            // Highlight hovered box
            ctx.drawImage( image, scale( bb.xMin! ), scale( bb.yMin! ), scale( bb.xMax! - bb.xMin! ), scale( bb.yMax! - bb.yMin! ) );
        } else if ( bb.highlightClass === 'highlight' ) {
            // Always draws an outline
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
