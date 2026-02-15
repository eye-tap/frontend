import {
    canvasSize, originalSize, zoomFactor
} from '../data';
import type {
    EditorPoint
} from '../types/annotation';
import {
    computeOffset
} from '../render/scaling';
import {
    overScrollDistanceForZoom
} from '../config';

/**
 * Move to a point in the original coordinates.
 * The viewport is moved such that positions are limited by the limits
 * of the original coordinate system (i.e. there are no blanks
 * beyond a certain limit to the right and left).
 * The overscroll is controlled by overScrollDistanceForZoom
 * @param target - The original size point to move to
 */
export const setViewPortOrigin = ( target: EditorPoint ) => {
    // translate to percentages (canvasPosition is in percentages)
    // Try to center target in the viewport
    return {
        'x': toPercentageOfOriginal( limiter( originFromCenter( target.x, 'width' ), 'width' ), 'width' ),
        'y': toPercentageOfOriginal( limiter( originFromCenter( target.y, 'height' ), 'height' ), 'height' )
    };
};

const toPercentageOfOriginal = ( val: number, side: 'width' | 'height' ) => {
    return val / originalSize.value[ side ];
};

const originFromCenter = ( val: number, side: 'width' | 'height' ) => {
    return val - ( originalSize.value[ side ] / 2 );
};

const limiter = ( val: number, side: 'width' | 'height' ) => {
    return Math.min(
        Math.max( -overScrollDistanceForZoom.value, val ),
        canvasSize.value[ side ] + overScrollDistanceForZoom.value
    );
};

/**
 * @returns The origin of the viewport in original size
 */
export const getViewPortOrigin = (): EditorPoint => {
    return {
        'x': computeOffset( 'x' ),
        'y': computeOffset( 'y' )
    };
};

export const resetZoom = () => {
    zoomFactor.value = 1;
};

export const setZoomFactor = ( factor: number ) => {
    if ( factor < 1 ) {
        console.warn( '[ ZOOM ] New zoom level not set due to invalid value (< 1)' );
    } else if ( factor > 5 ) {
        console.warn( '[ ZOOM ] New zoom level not set due to invalid value (> 5)' );
    } else {
        zoomFactor.value = factor;
    }
};
