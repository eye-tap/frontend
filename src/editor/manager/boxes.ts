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

let previousIdx = -1;

export const boxHighlightHandler = ( renderer: Renderer ) => {
    return ( pos: EditorPoint, highlightCurrent: boolean ) => {
        const idx = getBoxIdFromCoordinate( pos );

        let needToRedraw = false;

        if ( idx < 0 ) {
            if ( previousIdx < 0 ) return;

            needToRedraw = true;

            boundingBoxes.value[ previousIdx ]!.highlightClass = 'none';
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

            if ( boxesDisplay.value === 'proximity' ) {
                // Compute proximity
                const current = boundingBoxes.value[ idx ]!;

                for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
                    const bb = boundingBoxes.value[ i ]!;

                    // if inside radius
                    if ( i !== idx
                        && ( Math.sqrt( Math.pow( bb.centerX - current.centerX, 2 )
                            + Math.pow( bb.centerY - current.centerY, 2 ) ) < boundingBoxOnHoverRadius.value )
                    ) {
                        if ( bb.highlightClass !== 'proximity' ) {
                            bb.highlightClass = 'proximity';

                            needToRedraw = true;
                        }
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

// TODO: Highlighted setting
