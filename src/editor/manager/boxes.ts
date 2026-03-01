import {
    boundingBoxOnHoverRadius,
    boxesDisplay
} from '../config';
import type {
    EditorPoint
} from '../types/annotation';
import type {
    HighlightClass
} from '../types/boxes';
import type {
    Renderer
} from '../types/renderer';
import {
    boundingBoxes
} from '../data';
import {
    getBoxIdFromCoordinate
} from '../association/boxes';
import {
    getRenderer
} from '../render/manager';

let previousIdx = -1;
let previouslyRendered = false;

export const boxHighlightHandler = ( renderer: Renderer ) => {
    return ( pos: EditorPoint, highlightCurrent: boolean ) => {
        const idx = getBoxIdFromCoordinate( pos );

        let needToRedraw = false;

        if ( idx < 0 ) {
            if ( previousIdx > -1 ) {
                needToRedraw = true;

                setHighlightClass( previousIdx, 'none' );
            }
        } else {
            if ( idx !== previousIdx || ( !previouslyRendered && highlightCurrent ) ) {
                needToRedraw = true;

                if ( previousIdx > -1 )
                    setHighlightClass( previousIdx, 'none' );

                setHighlightClass( idx, 'hovered' );
            }

            if ( highlightCurrent === false ) {
                previouslyRendered = false;
                setHighlightClass( idx, 'none' );
                needToRedraw = true;
            } else {
                previouslyRendered = true;
            }
        }

        if ( boxesDisplay.value === 'proximity' ) {
            // Compute proximity
            for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
                const bb = boundingBoxes.value[ i ]!;

                // if inside radius
                if ( i !== idx
                    && ( Math.sqrt( Math.pow( bb.centerX - pos.x, 2 )
                        + Math.pow( bb.centerY - pos.y, 2 ) ) < boundingBoxOnHoverRadius.value )
                ) {
                    if ( bb.highlightClass !== 'proximity' ) {
                        setHighlightClass( i, 'proximity' );

                        needToRedraw = true;
                    }
                } else {
                    if ( bb.highlightClass === 'proximity' ) {
                        setHighlightClass( i, 'none' );

                        needToRedraw = true;
                    }
                }
            }
        }

        if ( needToRedraw ) {
            previousIdx = idx;
            renderer.renderBoxes.render();
        }
    };
};

const setHighlightClass = ( idx: number, highlightClass: HighlightClass ) => {
    if ( boundingBoxes.value[ idx ]!.highlightClass === 'highlight' ) {
        setPreviosHighlightClassForBoxIndex( idx, highlightClass );
    } else {
        boundingBoxes.value[ idx ]!.highlightClass = highlightClass;
    }
};

const prev: {
    [key: number]: HighlightClass
} = {};

export const setPreviosHighlightClassForBoxIndex = ( idx: number, previous: HighlightClass ) => {
    prev[ idx ] = previous;
};

/**
 * Set a box to highlighted (always draws an outline)
 * @param pos - The position at which to highlight the box
 * @param duration - Time in millis. Set to -1 to not automatically remove highlight
 */
export const highlightBoxByPos = ( pos: EditorPoint, duration: number ) => {
    highlightBox( getBoxIdFromCoordinate( pos ), duration );
};

export const highlightBox = ( idx: number, duration: number ) => {
    if ( idx < 0 ) return;

    const renderer = getRenderer();

    prev[ idx ] = boundingBoxes.value[ idx ]!.highlightClass;
    boundingBoxes.value[ idx ]!.highlightClass = 'highlight';

    renderer.renderBoxes.render();

    if ( duration > -1 ) {
        setTimeout( () => {
            if ( boundingBoxes.value[ idx ]!.highlightClass === 'highlight' ) {
                boundingBoxes.value[ idx ]!.highlightClass = prev[ idx ]!;

                renderer.renderBoxes.render();
            }
        }, duration );
    }
};

export const unHighlightBoxByPos = ( pos: EditorPoint ) => {
    unHighlightBox( getBoxIdFromCoordinate( pos ) );
};

export const unHighlightBox = ( idx: number ) => {
    const renderer = getRenderer();

    if ( boundingBoxes.value[ idx ]!.highlightClass === 'highlight' ) {
        boundingBoxes.value[ idx ]!.highlightClass = prev[ idx ]!;

        renderer.renderBoxes.render();
    }
};

export const resetAllBoxes = () => {
    const renderer = getRenderer();

    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        boundingBoxes.value[ i ]!.highlightClass = 'none';
    }

    renderer.renderBoxes.render();
};
