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
            const bgCol = {
                'r': data[0]!,
                'g': data[1]!,
                'b': data[2]!,
                'a': data[3]!
            };

            // TODO: Think of good filter to apply, because this is bad
            for ( let i = 0; i < data.length; i += 4 ) {
                if ( data[i]! !== bgCol[ 'r' ]
                    || data[i + 1] !== bgCol[ 'g' ]
                    || data[i + 2] !== bgCol[ 'b' ]
                    || data[i + 3] !== bgCol[ 'a' ]
                ) {
                    data[i] = color.r;
                    data[i + 1] = color.g;
                    data[i + 2] = color.b;
                    data[i + 3] = color.a;
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
