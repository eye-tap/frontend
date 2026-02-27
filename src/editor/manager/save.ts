import {
    annotations,
    boundingBoxes,
    fixations
} from '../data';
import {
    createDiff,
    createNumberDiff
} from '@/ts/annotations/diff';
import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import {
    sessionData,
    userAnnotations
} from '../loaders/backend';
import type {
    EditAnnotationsDto
} from '@/types/dtos/EditAnnotationsDto';
import annotation from '@/ts/annotations';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const revision = ref( 0 );

export const savedAtRevision = ref( 0 );

export const useSaveFunction = () => {
    const session = useAnnotationSessionStore();

    const save = async () => {
        const data: EditAnnotationsDto = {
            'annotations': {},
            'annotationsToRemove': {}
        };

        try {
            // Translate to correct ids
            const ann = createDiff( userAnnotations.value, annotations.value );

            ann.added.forEach( val => {
                data.annotations![ fixations.value[ val.fixationIdx ]!.id! ] = boundingBoxes.value[ val.boxIdx ]!.id!;
            } );

            ann.removed.forEach( val => {
                data.annotationsToRemove![ fixations.value[ val.fixationIdx ]!.id! ] = boundingBoxes.value[ val.boxIdx ]!.id!;
            } );

            // Process fixations marked as invalid
            const invalidMarked = fixations.value
                .map( val => {
                    return {
                        'state': val.assigned === 'invalid',
                        'id': val.id!
                    };
                } )
                .filter( val => val.state )
                .map( val => val.id );
            const diff = createNumberDiff( sessionData.value.removedFixations ?? [], invalidMarked );

            data.fixationsToRemove = diff.added;
            data.fixationsToUndoRemove = diff.removed;
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
            savedAtRevision.value = revision.value;
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
