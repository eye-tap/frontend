import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import {
    save
} from '..';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';
import {
    useNotification
} from '@kyvg/vue3-notification';

export function useAnnotationNavigation () {
    const isAnnotationComplete = ref( false );
    const nextAnnotationId = ref<number | null>( null );
    const store = useAnnotationSessionStore();
    const notifications = useNotification();

    const goToNextAnnotation = () => {
        console.log( 'Navigating to next...' );

        if ( nextAnnotationId.value == null ) {
            notifications.notify( {
                'text': 'No further annotation session available!',
                'type': 'warn',
                'title': 'Next Annotatation'
            } );
            console.warn( 'No next annotation ID available.' );

            return;
        }

        const nextIdx = store.sessionIds.findIndex( s => s.sessionId === nextAnnotationId.value );

        if ( nextIdx !== -1 ) {
            store.setActive( nextIdx );
        } else {
            console.warn( 'Next session ID not found in store.' );
        }

        isAnnotationComplete.value = false;
        nextAnnotationId.value = null;
    };

    const handleAnnotationDone = ( event: Event ) => {
        save();
        const customEvent = event as CustomEvent;
        const {
            next
        } = customEvent.detail;

        nextAnnotationId.value = next;
        isAnnotationComplete.value = true;
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:annotation-done', handleAnnotationDone );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:annotation-done', handleAnnotationDone );
    } );

    // Return the state and methods the component needs
    return {
        isAnnotationComplete,
        goToNextAnnotation
    };
}
