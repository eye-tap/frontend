import {
    type Ref,
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue';
import {
    canvasPosition,
    canvasSize,
    isSideBarCollapsed,
    originalSize,
    zoomFactor
} from '../data';
import type {
    Renderer
} from '../types/renderer';
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
    canvasSize.value.width = target;
    canvasSize.value.height = target * aspect;
    originalSize.value.width = original;
    originalSize.value.height = original * aspect;
};


/**
 * Compute the offset from the canvasPosition
 * @param coordinate - The coordinate axis to compute for
 * @returns The computed offset (subtract for going from original to scaled, add for opposite)
 */
export const computeOffset = ( coordinate: 'x' | 'y' ) => {
    return Math.round( canvasPosition.value[ coordinate ] * originalSize.value[ coordinate === 'x' ? 'width' : 'height' ] );
};

export const canvasToOriginalCoordinates = ( val: number, coordinate: 'x' | 'y' ) => {
    return val + computeOffset( coordinate );
};

export const originalToCanvasCoordinates = ( val: number, coordinate: 'x' | 'y' ) => {
    return val - computeOffset( coordinate );
};

/**
 * Scale function
 * @param value - The value to scale
 * @returns The scaled value
 */
export const scale = ( value: number ) => {
    return Math.round( value * scalingFactor.value * zoomFactor.value );
};

/**
 * Inverse scale function
 * @param value - The value to scale
 * @returns The scaled value
 */
export const scaleInverse = ( value: number ) => {
    return Math.round( value / ( scalingFactor.value * zoomFactor.value ) );
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

    watch( [
        zoomFactor,
        canvasPosition
    ], renderer.renderAll );

    watch( isSideBarCollapsed, () => {
        setTimeout( () => {
            scaler();
        }, 500 );
    } );

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
