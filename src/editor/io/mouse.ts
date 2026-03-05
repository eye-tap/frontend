import {
    type Ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import {
    canvasSize,
    isSideBarCollapsed
} from '../data';
import {
    canvasToOriginalCoordinates,
    scaleInverse,
    scalingFactor
} from '../render/scaling';
import {
    isMouseDragging,
    isZoomDragging,
    mouseClickPos,
    mouseDragEnd,
    mousePos
} from '../data/io';
import {
    moveHandler,
    zoomPanStartHandler
} from './zoom';
import {
    resetAllBoxes
} from '../manager/boxes';
import zoom from '../manager/zoom';
import {
    zoomScrollWheelDivideFactor
} from '../config';

export const mouseHandler = ( target: Ref<HTMLElement | null> ) => {
    let rect: DOMRect = new DOMRect( 0, 0, 0, 0 );

    const mouseDownHandler = ( ev: MouseEvent ) => {
        if ( ev.ctrlKey )
            // Zoom move is done using CTRL + drag
            zoomPanStartHandler( ev );
        else if ( ev.button === 0 ) {
            isMouseDragging.value = true;
            mouseClickPos.value = {
                'x': canvasToOriginalCoordinates( scaleInverse( ev.x - rect.left ), 'x' ),
                'y': canvasToOriginalCoordinates( scaleInverse( ev.y - rect.top ), 'y' )
            };
        }
    };

    const mouseUpHandler = ( ev: MouseEvent ) => {
        if ( ev.button === 0 ) {
            // End drag
            isMouseDragging.value = false;
            isZoomDragging.value = false;
            mouseDragEnd.value = {
                'x': canvasToOriginalCoordinates( scaleInverse( ev.x - rect.left ), 'x' ),
                'y': canvasToOriginalCoordinates( scaleInverse( ev.y - rect.top ), 'y' )
            };
        }
    };

    const mouseMoveHandler = ( ev: MouseEvent ) => {
        if ( ev.ctrlKey && ev.buttons === 1 ) {
            // Zoomed drag (to move view)
            moveHandler( ev );
        } else {
            // Set mouse position to use for rendering the drag line and also highlighting the boxes
            isZoomDragging.value = false;

            if ( ev.x < 0 || ev.y < 0 ) {
                isMouseDragging.value = false;

                return;
            }

            mousePos.value = {
                'x': canvasToOriginalCoordinates( scaleInverse( ev.x - rect.left ), 'x' ),
                'y': canvasToOriginalCoordinates( scaleInverse( ev.y - rect.top ), 'y' )
            };
        }
    };

    const scrollHandler = ( ev: WheelEvent ) => {
        if ( ev.ctrlKey ) {
            // Ctrl + Scroll for zooming in / out
            ev.preventDefault();
            zoom.zoom( -ev.deltaY / zoomScrollWheelDivideFactor.value, 'add' );
        } else {
            // Moving around in the canvas with scrolling
            ev.preventDefault();
            const pos = zoom.getViewPortOrigin();

            zoom.setViewPortOrigin( {
                'x': pos.x + ev.deltaX,
                'y': pos.y + ev.deltaY
            } );
        }
    };

    const updateRect = () => {
        // Updates the canvas bounding rect (used for offset computation)
        rect = target.value!.getBoundingClientRect();
    };

    const mouseLeaveHandler = () => {
        // If mouse leaves the canvas, reset the highlighting
        resetAllBoxes();
        isMouseDragging.value = false;
        isZoomDragging.value = false;
    };

    onMounted( () => {
        updateRect();
        target.value!.addEventListener( 'mousedown', mouseDownHandler );
        target.value!.addEventListener( 'mouseup', mouseUpHandler );
        target.value!.addEventListener( 'mousemove', mouseMoveHandler );
        target.value!.addEventListener( 'mouseleave', mouseLeaveHandler );
        target.value!.addEventListener( 'wheel', scrollHandler );
        window.addEventListener( 'resize', updateRect );
    } );

    onUnmounted( () => {
        try {
            target.value!.removeEventListener( 'mousedown', mouseDownHandler );
        } catch { /* empty */ }

        try {
            target.value!.removeEventListener( 'mouseup', mouseUpHandler );
        } catch { /* empty */ }

        try {
            target.value!.removeEventListener( 'mousemove', mouseMoveHandler );
        } catch { /* empty */ }

        try {
            target.value!.removeEventListener( 'mouseleave', mouseLeaveHandler );
        } catch { /* empty */ }

        try {
            target.value!.removeEventListener( 'wheel', scrollHandler );
        } catch { /* empty */ }

        try {
            window.removeEventListener( 'resize', updateRect );
        } catch { /* empty */ }
    } );

    watch( [
        canvasSize,
        scalingFactor
    ], updateRect );

    // Canvas rect update trigger (to make sure it is correct, even if one of the other functions messed up)
    watch( isSideBarCollapsed, () => {
        setTimeout( () => {
            updateRect();
        }, 600 );
    } );
};
