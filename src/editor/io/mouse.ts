import {
    type Ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import {
    canvasToOriginalCoordinates,
    scaleInverse
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
    canvasSize
} from '../data';
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
        updateRect();

        if ( ev.ctrlKey )
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
        updateRect();

        if ( ev.button === 0 ) {
            isMouseDragging.value = false;
            isZoomDragging.value = false;
            mouseDragEnd.value = {
                'x': canvasToOriginalCoordinates( scaleInverse( ev.x - rect.left ), 'x' ),
                'y': canvasToOriginalCoordinates( scaleInverse( ev.y - rect.top ), 'y' )
            };
        }
    };

    const mouseMoveHandler = ( ev: MouseEvent ) => {
        updateRect();

        if ( ev.ctrlKey && ev.buttons === 1 ) {
            moveHandler( ev );
        } else {
            isZoomDragging.value = false;

            if ( ev.x < 0 || ev.y < 0 ) {
                isMouseDragging.value = false;
                isZoomDragging.value = false;

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
            ev.preventDefault();
            zoom.zoom( ev.deltaY / zoomScrollWheelDivideFactor.value, 'add' );
        }
    };

    const updateRect = () => {
        rect = target.value!.getBoundingClientRect();
    };

    const mouseLeaveHandler = () => {
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

    watch( canvasSize, updateRect );
};
