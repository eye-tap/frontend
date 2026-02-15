import {
    boundingBoxOnHoverRadius,
    boxesDisplay
} from '../config';
import type {
    EditorPoint
} from '../types/annotation';
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

export const boxHighlightHandler = ( renderer: Renderer ) => {
    return ( pos: EditorPoint, highlightCurrent: boolean ) => {
        const idx = getBoxIdFromCoordinate( pos );

        let needToRedraw = false;

        if ( idx < 0 ) {
            if ( previousIdx > -1 ) {
                needToRedraw = true;

                boundingBoxes.value[ previousIdx ]!.highlightClass = 'none';
            }
        } else {
            if ( idx !== previousIdx ) {
                needToRedraw = true;

                if ( previousIdx > -1 )
                    boundingBoxes.value[ previousIdx ]!.highlightClass = 'none';

                boundingBoxes.value[ idx ]!.highlightClass = 'hovered';
            }

            if ( highlightCurrent === false ) {
                needToRedraw = true;
                boundingBoxes.value[ idx ]!.highlightClass = 'none';
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
                        bb.highlightClass = 'proximity';

                        needToRedraw = true;
                    }
                } else {
                    if ( bb.highlightClass === 'proximity' ) {
                        bb.highlightClass = 'none';

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

// TODO: Marking boxes as highlighted
const prev: {
    [key: number]: string
} = {};

export const setPreviosHighlightClassForBoxIndex = ( idx: number, previous: string ) => {
    prev[ idx ] = previous;
};

/**
 * Set a box to highlighted (always draws an outline)
 * @param pos - The position at which to highlight the box
 * @param duration - Time in millis. Set to -1 to not automatically remove highlight
 */
export const highlightBox = ( pos: EditorPoint, duration: number ) => {
    const idx = getBoxIdFromCoordinate( pos );

    if ( idx < 0 ) return;

    const renderer = getRenderer();

    prev[ idx ] = boundingBoxes.value[ idx ]!.highlightClass;
    boundingBoxes.value[ idx ]!.highlightClass = 'highlight';

    renderer.renderBoxes.render();

    if ( duration > -1 ) {
        setTimeout( () => {
            if ( boundingBoxes.value[ idx ]!.highlightClass === 'highlight' ) {
                boundingBoxes.value[ idx ]!.highlightClass = 'none';

                renderer.renderBoxes.render();
            }
        }, duration );
    }
};

export const resetAllBoxes = () => {
    const renderer = getRenderer();

    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        boundingBoxes.value[ i ]!.highlightClass = 'none';
    }

    renderer.renderBoxes.render();
};
