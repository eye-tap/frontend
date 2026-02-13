import {
    type Ref,
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import type {
    Renderer
} from '../types/renderer';
import {
    canvasSize
} from '../data';
import {
    referenceCanvasSize
} from '../config';

export const scalingFactor = ref( 1 );

/**
 * Compute the scale factor and canvas size using canvas aspect ratio
 * @param original - The original element size (usually width)
 * @param target - The target size (usually width)
 * @param aspect - The target aspect ratio (usually height divided by width)
 */
export const computeScaleFactor = ( original: number, target: number, aspect: number ) => {
    scalingFactor.value = Math.round( target / original * 1000 ) / 1000;
    canvasSize.value.width = original * scalingFactor.value;
    canvasSize.value.height = canvasSize.value.width * aspect;
};

/**
 * Simple scale function to reduce writing
 * @param value - The value to scale
 * @returns The scaled value
 */
export const scale = ( value: number ) => {
    return Math.round( value * scalingFactor.value );
};

/**
 * Simple scale function to reduce writing. Scales the opposite way
 * @param value - The value to scale
 * @returns The scaled value
 */
export const scaleInverse = ( value: number ) => {
    return Math.round( value / scalingFactor.value );
};

/**
 * Automatically scale the canvas
 * @param elementToGetParentFrom - An element that is to be scaled to its parent
 * @param renderer - The renderer to enable redrawing
 */
export const useScaler = ( elementToGetParentFrom: Ref<HTMLElement | null>, renderer: Renderer ) => {
    const image = renderer.textImage;

    const scaler = () => {
        const target = elementToGetParentFrom.value!.parentElement!;

        if ( image.src !== '' && image.complete )
            computeScaleFactor( image.width, target.clientWidth, image.height / image.width );
        else
            computeScaleFactor( referenceCanvasSize.width, target.clientWidth, referenceCanvasSize.height / referenceCanvasSize.width );

        renderer.renderAll();
    };

    onMounted( () => {
        window.addEventListener( 'resize', scaler );
        image.onload = scaler;

        scaler();
    } );

    onUnmounted( () => {
        try {
            window.removeEventListener( 'resize', scaler );
        } catch { /* empty */ }
    } );
};
