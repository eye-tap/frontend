import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    boxesDisplay,
    unfocusedTextColor
} from '../config';
import {
    canvasToOriginalCoordinates,
    scale
} from './scaling';
import {
    canvasSize
} from '../data';
import {
    setImageTextColour
} from './image-magic';

// TODO: Add note somewhere that Canvas might look odd, simply tell user to allow usage of canvas in browser
export const textRenderer = ( textCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = async () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        if ( image.complete && image.src !== '' ) {
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;

            if ( boxesDisplay.value === 'letters' ) {
                const imgData = setImageTextColour( image, unfocusedTextColor.value, {
                    'x': 0,
                    'y': 0,
                    'width': image.width,
                    'height': image.height,
                    'scale': true
                } );

                ctx.putImageData( imgData, 0, 0 );
            } else {
                ctx.drawImage(
                    image,
                    canvasToOriginalCoordinates( 0, 'x' ),
                    canvasToOriginalCoordinates( 0, 'y' ),
                    image.width,
                    image.height,
                    0,
                    0,
                    scale( image.width ),
                    scale( image.height )
                );
            }
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

    watch( boxesDisplay, ( val, oldVal ) => {
        if ( oldVal === 'letters' && val !== 'letters' ) render();

        if ( oldVal !== 'letters' && val === 'letters' ) render();
    } );

    return {
        render
    };
};
