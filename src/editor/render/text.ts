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
    imageDataToProvidedImageElement,
    setImageTextColour
} from './image-magic';
import {
    canvasSize
} from '../data';

export const textRenderer = ( textCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    const updatedTextCache = document.createElement( 'img' );

    let ctx: CanvasRenderingContext2D | null = null;

    const render = async ( full: boolean = false ) => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        if ( image.complete && image.src !== '' ) {
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;

            if ( boxesDisplay.value === 'letters' ) {
                if ( full || !updatedTextCache.src ) {
                    const imgData = setImageTextColour( image, unfocusedTextColor.value, {
                        'x': 0,
                        'y': 0,
                        'width': image.width,
                        'height': image.height,
                        'scale': false
                    } );

                    imageDataToProvidedImageElement( imgData, image.width, image.height, updatedTextCache )
                        .then( () => drawImage( updatedTextCache ) );
                } else {
                    drawImage( updatedTextCache );
                }
            } else {
                drawImage( image );
            }
        } else {
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;
        }
    };

    const drawImage = ( image: HTMLImageElement ) => {
        ctx!.drawImage(
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
    };

    onMounted( () => {
        ctx = textCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( unfocusedTextColor, () => render( true ) );

    watch( boxesDisplay, ( val, oldVal ) => {
        if ( oldVal === 'letters' && val !== 'letters' ) render();

        if ( oldVal !== 'letters' && val === 'letters' ) render();
    } );

    return {
        render
    };
};
