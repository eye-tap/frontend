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

export const revision = ref( 0 );

export const useSaveFunction = () => {
    const session = useAnnotationSessionStore();

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
        }

        try {
            await annotation.save( data, session.sessionIds[session.sessionIdx]!.sessionId ).then();
            document.dispatchEvent( new CustomEvent( 'eyetap:save:success' ) );
        } catch ( e ) {
            document.dispatchEvent( new CustomEvent( 'eyetap:save:fail', {
                'detail': {
                    'reason': 'ERR_BACKEND_SEND',
                    'error': e
                }
            } ) );
        }
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );
};
