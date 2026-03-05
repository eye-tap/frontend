import {
    canvasPosition,
    fixations,
    originalSize,
    selectedFixation,
    zoomFactor
} from '../data';
import {
    computeOffset,
    scale
} from '../render/scaling';
import type {
    EditorPoint
} from '../types/annotation';
import {
    overScrollDistanceForZoom
} from '../config';

/**
 * @returns The origin of the viewport in original size
 */
const getViewPortOrigin = (): EditorPoint => {
    return {
        'x': computeOffset( 'x' ),
        'y': computeOffset( 'y' )
    };
};

/**
 * Move to a point in the original coordinates.
 * The viewport is moved such that positions are limited by the limits
 * of the original coordinate system (i.e. there are no blanks
 * beyond a certain limit to the right and left).
 * The overscroll is controlled by overScrollDistanceForZoom
 * @param target - The original size point to move to
 */
const setViewPortOriginFromCenter = ( target: EditorPoint ) => {
    // translate to percentages (canvasPosition is in percentages)
    // Try to center target in the viewport
    canvasPosition.value = {
        'x': roundToDigits( toPercentageOfOriginal( limiter( centerCoordinateInViewPort( target.x, 'width' ), 'width' ), 'width' ) ),
        'y': roundToDigits( toPercentageOfOriginal( limiter( centerCoordinateInViewPort( target.y, 'height' ), 'height' ), 'height' ) )
    };
    console.log( {
        ...canvasPosition.value
    } );
};

/**
 * Move to a point in the original coordinates.
 * The viewport is moved such that positions are limited by the limits
 * of the original coordinate system (i.e. there are no blanks
 * beyond a certain limit to the right and left).
 * The overscroll is controlled by overScrollDistanceForZoom
 * @param target - The original size point to move to
 */
const setViewPortOrigin = ( target: EditorPoint ) => {
    // translate to percentages (canvasPosition is in percentages)
    // Try to center target in the viewport
    canvasPosition.value = {
        'x': roundToDigits( toPercentageOfOriginal( limiter( target.x, 'width' ), 'width' ) ),
        'y': roundToDigits( toPercentageOfOriginal( limiter( target.y, 'height' ), 'height' ) )
    };
};


/** Rounds to 2 digits */
const roundToDigits = ( val: number ) => Math.round( val * 100 ) / 100;

/** Get the percentage offset from the original position */
const toPercentageOfOriginal = ( val: number, side: 'width' | 'height' ) => {
    return val / originalSize.value[ side ];
};

/** Get the origin coordinate of the text from the center */
const centerCoordinateInViewPort = ( val: number, side: 'width' | 'height' ) => {
    const shownPixels = originalSize.value[ side ] / zoomFactor.value;

    return val - ( shownPixels / 2 );
};

/** Sets limits for the zoom move (i.e. so you can't move the entire text out of view */
const limiter = ( val: number, side: 'width' | 'height' ) => {
    return Math.min(
        Math.max(
            -scale( overScrollDistanceForZoom.value ),
            val
        ),
        originalSize.value[ side ] + scale( overScrollDistanceForZoom.value )
        - ( originalSize.value[ side ] / zoomFactor.value )
    );
};


/** Resets the zoom */
const reset = () => {
    canvasPosition.value = {
        'x': 0,
        'y': 0
    };
    zoomFactor.value = 1;
};

/** Sets the zoom factor, using guards */
const setFactor = ( factor: number ) => {
    if ( factor < 1 ) {
        console.warn( '[ ZOOM ] New zoom level not set due to invalid value (< 1)' );
    } else if ( factor > 3 ) {
        console.warn( '[ ZOOM ] New zoom level not set due to invalid value (> 3)' );
    }

    zoomFactor.value = Math.min( Math.max( factor, 1 ), 3 );

    if ( selectedFixation.value < 0 )
        setViewPortOrigin( getViewPortOrigin() );
    else
        setViewPortOriginFromCenter( {
            'x': fixations.value[ selectedFixation.value ]!.x!,
            'y': fixations.value[ selectedFixation.value ]!.y!
        } );
};

/** Returns the zoom factor */
const getFactor = () => {
    return zoomFactor.value;
};

/** Apply zoom with diff, i.e. how much to add / subtract or multiply / divide by */
const zoom = ( diff: number, mode: 'add' | 'multiply' = 'add' ) => {
    if ( mode === 'add' )
        setFactor( getFactor() + diff );
    else
        setFactor( Math.abs( getFactor() * diff ) );
};

export default {
    setViewPortOriginFromCenter,
    setViewPortOrigin,
    getViewPortOrigin,
    setFactor,
    getFactor,
    reset,
    zoom,
    roundToDigits
};
