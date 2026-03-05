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

/**
 * Change the colour of the text in an image with uniform background
 * @param image - The image to process
 * @param col - The colour to set the text to
 * @param slice - The slice to take from the image (i.e. if you don't want to apply it to the full image)
 * @returns The image data with the conversion applied
 */
export const setImageTextColour = ( image: HTMLImageElement, col: Color, slice: ImageSlice ): ImageData => {
    const ctx = canvas.getContext( '2d' )!;

    // Draw the image into a separate canvas
    if ( slice.scale ) {
        // With automated scaling of values
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
        // Without scaling
        canvas.width = slice.width;
        canvas.height = slice.height;
        ctx.drawImage( image, slice.x, slice.y, slice.width, slice.height );
    }

    const imgData = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );
    const data = imgData.data;
    // Pick a pixel (10, 10) as background reference
    // Compute ambiance and luminance of it
    const bgReferencePoint = ( 10 * imgData.width ) + ( 10 * 4 );
    const bgAmbiance = data[ bgReferencePoint + 3 ];
    const bgLuminance = ( data[ bgReferencePoint ]! + data[ bgReferencePoint + 1 ]! + data[ bgReferencePoint + 2 ]! ) / 3;

    for ( let i = 0; i < data.length; i += 4 ) {
        const luminance = ( data[i]! + data[i + 1]! + data[i + 2]! ) / 3;

        // Check that pixel is not part of the background
        if ( luminance !== bgLuminance || data[i + 3] !== bgAmbiance ) {
            // We can change colour without destroying the aliasing by dividing by luminance
            const l = luminance > 0 ? luminance : 1;

            data[i] = Math.round( col.r / l );
            data[i + 1] = Math.round( col.g / l );
            data[i + 2] = Math.round( col.b / l );
        }
    }

    ctx.putImageData( imgData, 0, 0 );

    return imgData;
};

const img = document.createElement( 'img' );
const exportCanvas = document.createElement( 'canvas' );

/**
 * Convert image data to an image element. Be aware that the contents of the element will change.
 * If it is a constraint that it won't change, use imageDataToProvidedImageElement instead
 * @param imgData - The image data to put into the image element
 * @param width - The width of the image
 * @param height - The height of the image
 * @returns An image element that is not always guaranteed to contain this image
 * (if you call this function again, the contents will change)
 */
export const imgDataToImageObject = ( imgData: ImageData, width: number, height: number ): Promise<HTMLImageElement> => {
    return new Promise( ( resolve, reject ) => {
        imageDataToProvidedImageElement( imgData, width, height, img )
            .then( () => resolve( img ) )
            .catch( reject );
    } );
};


/**
 * Convert image data to an image element.
 * @param imgData - The image data to put into the image element
 * @param width - The width of the image
 * @param height - The height of the image
 * @param img - The image element to write into
 * @returns a promise that resolves as soon as the operation has completed
 */
export const imageDataToProvidedImageElement = (
    imgData: ImageData,
    width: number,
    height: number,
    img: HTMLImageElement
): Promise<void> => {
    return new Promise( resolve => {
        const ctx = exportCanvas.getContext( '2d' )!;

        exportCanvas.width = width;
        exportCanvas.height = height;

        ctx.putImageData( imgData, 0, 0 );
        const uri = exportCanvas.toDataURL( 'image/jpg' );

        img.onload = () => resolve();
        img.src = uri;
    } );
};
