import {
    type Ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import {
    isMouseDragging,
    mouseClickPos,
    mouseDragEnd,
    mousePos
} from '../data/io';
import {
    canvasSize
} from '../data';
import {
    scaleInverse
} from '../render/scaling';

export const mouseHandler = ( target: Ref<HTMLElement | null> ) => {
    let rect: DOMRect = new DOMRect( 0, 0, 0, 0 );

    const mouseDownHandler = ( ev: MouseEvent ) => {
        if ( ev.button === 0 ) {
            isMouseDragging.value = true;
            mouseClickPos.value = {
                'x': scaleInverse( ev.x - rect.left ),
                'y': scaleInverse( ev.y - rect.top )
            };
        }
    };

    const mouseUpHandler = ( ev: MouseEvent ) => {
        if ( ev.button === 0 ) {
            isMouseDragging.value = false;
            mouseDragEnd.value = {
                'x': scaleInverse( ev.x - rect.left ),
                'y': scaleInverse( ev.y - rect.top )
            };
        }
    };

    const mouseMoveHandler = ( ev: MouseEvent ) => {
        if ( ev.x < 0 || ev.y < 0 ) {
            isMouseDragging.value = false;

            return;
        }

        mousePos.value = {
            'x': scaleInverse( ev.x - rect.left ),
            'y': scaleInverse( ev.y - rect.top )
        };
    };

    const updateRect = () => {
        rect = target.value!.getBoundingClientRect();
    };

    // TODO: Mouseleave handler

    onMounted( () => {
        updateRect();
        target.value!.addEventListener( 'mousedown', mouseDownHandler );
        target.value!.addEventListener( 'mouseup', mouseUpHandler );
        target.value!.addEventListener( 'mousemove', mouseMoveHandler );
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
    } );

    watch( canvasSize, updateRect );
};
