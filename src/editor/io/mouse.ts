import {
    type Ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import {
    computeOffset,
    scaleInverse
} from '../render/scaling';
import {
    isMouseDragging,
    mouseClickPos,
    mouseDragEnd,
    mousePos
} from '../data/io';
import {
    canvasSize
} from '../data';

export const mouseHandler = ( target: Ref<HTMLElement | null> ) => {
    let rect: DOMRect = new DOMRect( 0, 0, 0, 0 );

    const mouseDownHandler = ( ev: MouseEvent ) => {
        if ( ev.button === 0 ) {
            isMouseDragging.value = true;
            mouseClickPos.value = {
                'x': scaleInverse( ev.x - rect.left ) + computeOffset( 'x' ),
                'y': scaleInverse( ev.y - rect.top ) + computeOffset( 'y' )
            };
        }
    };

    const mouseUpHandler = ( ev: MouseEvent ) => {
        if ( ev.button === 0 ) {
            isMouseDragging.value = false;
            mouseDragEnd.value = {
                'x': scaleInverse( ev.x - rect.left ) + computeOffset( 'x' ),
                'y': scaleInverse( ev.y - rect.top ) + computeOffset( 'y' )
            };
        }
    };

    const mouseMoveHandler = ( ev: MouseEvent ) => {
        if ( ev.x < 0 || ev.y < 0 ) {
            isMouseDragging.value = false;

            return;
        }

        mousePos.value = {
            'x': scaleInverse( ev.x - rect.left ) + computeOffset( 'x' ),
            'y': scaleInverse( ev.y - rect.top ) + computeOffset( 'y' )
        };
    };

    const updateRect = () => {
        rect = target.value!.getBoundingClientRect();
    };

    // TODO: Mouseleave handler (clears boxes and lines)

    onMounted( () => {
        updateRect();
        target.value!.addEventListener( 'mousedown', mouseDownHandler );
        target.value!.addEventListener( 'mouseup', mouseUpHandler );
        target.value!.addEventListener( 'mousemove', mouseMoveHandler );
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
            window.removeEventListener( 'resize', updateRect );
        } catch { /* empty */ }
    } );

    watch( canvasSize, updateRect );
};
