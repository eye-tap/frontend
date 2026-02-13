import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    cursorLineColor,
    lineWidth,
    moveThresholdForDrag
} from '../config';
import {
    isMouseDragging,
    lineStart,
    mousePos
} from '../data/io';
import {
    canvasSize
} from '../data';
import {
    scale
} from './scaling';

export const ioRenderer = ( ioCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        clearCanvas();
        ctx.lineWidth = lineWidth.value;
        ctx.strokeStyle = cursorLineColor.value;

        // Render
        if ( ( Math.abs( lineStart.value.x - mousePos.value.x ) < moveThresholdForDrag
            && Math.abs( lineStart.value.y - mousePos.value.y ) < moveThresholdForDrag )
        || ( lineStart.value.x < 0 || lineStart.value.y < 0 || mousePos.value.x < 0 || mousePos.value.y < 0 )
        || !isMouseDragging.value
        )
            return;

        ctx!.beginPath();
        ctx!.moveTo( scale( lineStart.value.x ), scale( lineStart.value.y ) );
        ctx!.lineTo( scale( mousePos.value.x ), scale( mousePos.value.y ) );
        ctx!.stroke();
    };

    const clearCanvas = () => {
        if ( !ctx ) return;

        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
    };

    watch( isMouseDragging, clearCanvas );

    onMounted( () => {
        ctx = ioCanvas.value!.getContext( '2d' )!;
        render();
    } );

    return {
        render
    };
};
