import {
    isMouseDragging,
    isZoomDragging
} from '../data/io';
import type {
    EditorPoint
} from '../types/annotation';
import {
    scaleInverse
} from '../render/scaling';
import zoom from '../manager/zoom';

let zoomClickPos: EditorPoint = {
    'x': -1,
    'y': -1
};

export const zoomPanStartHandler = ( ev: MouseEvent ) => {
    if ( ev.button === 0 ) {
        isZoomDragging.value = true;
        isMouseDragging.value = false;
        zoomClickPos = {
            'x': scaleInverse( ev.x ),
            'y': scaleInverse( ev.y )
        };

        originalCanvasPosition = zoom.getViewPortOrigin();
    }
};

let originalCanvasPosition = {
    'x': 0,
    'y': 0
};

export const moveHandler = ( ev: MouseEvent ) => {
    if ( !isZoomDragging.value ) {
        zoomPanStartHandler( ev );
    }

    const diff: EditorPoint = {
        'x': Math.round( zoomClickPos.x - scaleInverse( ev.x ) ),
        'y': Math.round( zoomClickPos.y - scaleInverse( ev.y ) )
    };

    zoom.setViewPortOrigin( {
        'x': originalCanvasPosition.x + diff.x,
        'y': originalCanvasPosition.y + diff.y
    } );
};

export const providedOffsetHandler = ( diffX: number, diffY: number ) => {
    const curr = zoom.getViewPortOrigin();

    zoom.setViewPortOrigin( {
        'x': curr.x + diffX,
        'y': curr.y + diffY
    } );
};
