import {
    type Ref, onMounted
} from 'vue';
import zoom from '../manager/zoom';
import {
    zoomTouchAndTrackpadDivideFactor
} from '../config';


// NOTE: This is *not* integrated anywhere currently.
// I wrote it before realizing that it doesn't even work like this... yeah
// The thing is: The browser abstracts pinch gestures on trackpad into Ctrl + Scroll automatically,
// so we don't need a special handler. It is in here just to make sure that if we still need it, we can
// quickly integrate it.
// Quite a bit of this code is from https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
export const touchAndTrackpadHandler = ( target: Ref<HTMLElement | null> ) => {
    const eventCache: PointerEvent[] = [];

    let prevDiff = -1;

    const pointerDownHandler = ( ev: PointerEvent ) => {
        console.log( 'Pointer down' );
        eventCache.push( ev );
    };

    const pointerUpHandler = ( ev: PointerEvent ) => {
        removeEvent( ev );

        if ( eventCache.length < 2 ) {
            prevDiff = -1;
        }
    };

    const pointerMoveHandler = ( ev: PointerEvent ) => {
        const index = eventCache.findIndex(
            cachedEv => cachedEv.pointerId === ev.pointerId
        );

        if ( index < 0 ) return;

        eventCache[index] = ev;

        if ( eventCache.length === 2 ) {
            console.log( 'Hello world' );
            // Calculate the distance between the two pointers
            const curDiff = Math.hypot(
                eventCache[0]!.clientX - eventCache[1]!.clientX,
                eventCache[0]!.clientY - eventCache[1]!.clientY
            );

            if ( prevDiff > 0 ) {
                // if curDiff > prevDiff -> zoom in
                console.log( 'Diff 1', prevDiff - curDiff, 'Diff 2', curDiff - prevDiff );
                zoom.zoom( ( prevDiff - curDiff ) / zoomTouchAndTrackpadDivideFactor.value, 'add' );
            }

            // Cache the distance for the next move event
            prevDiff = curDiff;
        }
    };

    const removeEvent = ( ev: PointerEvent ) => {
        // Remove this event from the target's cache
        const index = eventCache.findIndex(
            cachedEv => cachedEv.pointerId === ev.pointerId
        );

        if ( index >= 0 )
            eventCache.splice( index, 1 );
    };

    onMounted( () => {
        target.value!.addEventListener( 'pointerdown', pointerDownHandler );
        target.value!.addEventListener( 'pointerup', pointerUpHandler );
        target.value!.addEventListener( 'pointermove', pointerMoveHandler );
        target.value!.addEventListener( 'pointerout', pointerUpHandler );
    } );
};
