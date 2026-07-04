import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import {
    save,
    saveNeeded
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
        if ( saveNeeded.value ) save();

        let nextIdx = ( store.sessionIdx + 1 ) % store.sessionIds.length;

        while ( store.sessionIds[ nextIdx ]!.completed ) {
            nextIdx = ( nextIdx + 1 ) % store.sessionIds.length;

            if ( nextIdx === store.sessionIdx ) {
                notifications.notify( {
                    'text': 'No further annotation session available!',
                    'type': 'warn',
                    'title': 'Next Annotatation'
                } );

                return;
            }
        }

        store.setActive( nextIdx );
        isAnnotationComplete.value = false;
        nextAnnotationId.value = null;
        document.dispatchEvent( new CustomEvent( 'eyetap:file:loading' ) );
    };

    const handleAnnotationDone = ( event: Event ) => {
        save();
        store.setCompleted();
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
