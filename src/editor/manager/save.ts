import {
    annotations,
    boundingBoxes,
    fixations
} from '../data';
import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import type {
    EditAnnotationsDto
} from '@/types/dtos/EditAnnotationsDto';
import annotation from '@/ts/annotations';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';
import {
    useNotification
} from '@kyvg/vue3-notification';

export const revision = ref( 0 );

export const useSaveFunction = () => {
    const session = useAnnotationSessionStore();
    const notifications = useNotification();

    const save = async () => {
        const data: EditAnnotationsDto = {
            'annotations': {}
        };

        try {
        // Translate to correct ids
            annotations.value.forEach( val => {
                data.annotations![ fixations.value[ val.fixationId ]!.id! ] = boundingBoxes.value[ val.boxId ]!.id!;
            } );
        } catch ( e ) {
            document.dispatchEvent( new CustomEvent( 'eyetap:save:fail', {
                'detail': {
                    'reason': 'ERR_PREPROCESSING',
                    'error': e
                }
            } ) );
            notifications.notify( {
                'text': 'There was an error saving your data',
                'type': 'error',
                'title': 'Editor'
            } );
        }

        try {
            await annotation.save( data, session.sessionIds[session.sessionIdx]!.sessionId ).then();
            notifications.notify( {
                'text': 'Your progress has been saved',
                'type': 'success',
                'title': 'Editor'
            } );
            document.dispatchEvent( new CustomEvent( 'eyetap:save:success' ) );
        } catch ( e ) {
            document.dispatchEvent( new CustomEvent( 'eyetap:save:fail', {
                'detail': {
                    'reason': 'ERR_BACKEND_SEND',
                    'error': e
                }
            } ) );
            notifications.notify( {
                'text': 'There was an error saving your data',
                'type': 'error',
                'title': 'Editor'
            } );
        }
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );
};
