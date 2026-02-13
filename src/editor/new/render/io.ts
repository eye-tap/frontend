import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    assignedLineColor,
    lineWidth
} from '../config';
import {
    isMouseDragging,
    mouseClickPos,
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
        ctx.strokeStyle = assignedLineColor.value;

        // Render
        if ( ( Math.abs( mouseClickPos.value.x - mousePos.value.x ) < 10 && Math.abs( mouseClickPos.value.y - mousePos.value.y ) < 10 )
            || ( mouseClickPos.value.x < 0 || mouseClickPos.value.y < 0 || mousePos.value.x < 0 || mousePos.value.y < 0 )
        )
            return;

        ctx!.beginPath();
        ctx!.moveTo( scale( mouseClickPos.value.x ), scale( mouseClickPos.value.y ) );
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
