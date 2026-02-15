import {
    canvasToOriginalCoordinates,
    scale
} from './scaling';
import type {
    Color
} from '../types/boxes';
import type {
    ImageSlice
} from '../types/renderer';

const canvas = document.createElement( 'canvas' );

export const setImageTextColour = ( image: HTMLImageElement, col: Color, slice: ImageSlice ): ImageData => {
    const ctx = canvas.getContext( '2d' )!;

    if ( slice.scale ) {
        canvas.width = scale( slice.width );
        canvas.height = scale( slice.height );
        ctx.drawImage(
            image,
            canvasToOriginalCoordinates( slice.x, 'x' ),
            canvasToOriginalCoordinates( slice.y, 'y' ),
            slice.width,
            slice.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        canvas.width = slice.width;
        canvas.height = slice.height;
        ctx.drawImage( image, slice.x, slice.y, slice.width, slice.height );
    }

    const imgData = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );
    const color = col;
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

    ctx.putImageData( imgData, 0, 0 );
    canvas.toDataURL( 'image/jpg' );

    return imgData;
};

const img = document.createElement( 'img' );
const exportCanvas = document.createElement( 'canvas' );

export const imgDataToImageObject = ( imgData: ImageData, width: number, height: number ): Promise<HTMLImageElement> => {
    return new Promise( resolve => {
        const ctx = exportCanvas.getContext( '2d' )!;

        exportCanvas.width = width;
        exportCanvas.height = height;

        ctx.putImageData( imgData, 0, 0 );
        const uri = exportCanvas.toDataURL( 'image/jpg' );

        img.onload = () => resolve( img );
        img.src = uri;
    } );
};
