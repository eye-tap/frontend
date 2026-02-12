import {
    type Ref,
    onMounted
} from 'vue';
import {
    canvasSize
} from '../data';
import {
    computeScaleFactor
} from '../util/scaling';
import {
    unfocusedTextColor
} from '../config';

export const textRenderer = ( textCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = async () => {
        if ( !ctx ) return;

        const target = textCanvas.value!.parentElement!;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        if ( image.complete && image.src !== '' ) {
            computeScaleFactor( image.width, target.clientWidth, image.height / image.width );
            ctx.canvas.width = canvasSize.value.width;
            ctx.canvas.height = canvasSize.value.height;
            ctx.drawImage( image, 0, 0, ctx.canvas.width, ctx.canvas.height );
            const imgData = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );
            const color = unfocusedTextColor.value;
            const data = imgData.data;
            const bgReferencePoint = ( 10 * imgData.width ) + ( 10 * 4 );
            const bgAmbiance = data[ bgReferencePoint + 3 ];
            const bgLuminance = ( data[ bgReferencePoint ]! + data[ bgReferencePoint + 1 ]! + data[ bgReferencePoint + 2 ]! ) / 3;

            for ( let i = 0; i < data.length; i += 4 ) {
                const luminance = ( data[i]! + data[i + 1]! + data[i + 2]! ) / 3;

                if ( luminance !== bgLuminance || data[i + 3] !== bgAmbiance ) {
                    const l = luminance > 0 ? luminance : 0;

                    data[i] = Math.round( color.r / l );
                    data[i + 1] = Math.round( color.g / l );
                    data[i + 2] = Math.round( color.b / l );
                }
            }

            ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
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

    return {
        render
    };
};
