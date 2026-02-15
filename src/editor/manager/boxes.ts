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

export const resetAllBoxes = () => {
    const renderer = getRenderer();

    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        boundingBoxes.value[ i ]!.highlightClass = 'none';
    }

    renderer.renderBoxes.render();
};
