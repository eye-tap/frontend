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

        const nextIdx = store.sessionIdx + 1;

        if ( nextIdx >= store.sessionIds.length ) {
            notifications.notify( {
                'text': 'No further annotation session available!',
                'type': 'warn',
                'title': 'Next Annotatation'
            } );
            console.warn( 'No next annotation ID available.' );

            return;
        }

        store.setActive( nextIdx );
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
