import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    canvasSize
} from '../data';
import {
    setImageTextColour
} from './image-magic';
import {
    unfocusedTextColor
} from '../config';

export const textRenderer = ( textCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = async () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        // TODO: Add note somewhere that Canvas might look odd, simply tell user to allow usage of canvas in browser

        if ( image.complete && image.src !== '' ) {
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;

            const imgData = setImageTextColour( image, unfocusedTextColor.value, {
                'x': 0,
                'y': 0,
                'width': image.width,
                'height': image.height,
                'scale': true
            } );

            ctx.putImageData( imgData, 0, 0 );
        } else {
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;
        }
    };

    onMounted( () => {
        ctx = textCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( unfocusedTextColor, render );

    return {
        render
    };
};
