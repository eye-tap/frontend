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
    invalidatedFixations,
    userAnnotations
} from '../loaders/backend';
import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import type {
    EditAnnotationsDto
} from '@/types/dtos/EditAnnotationsDto';
import annotation from '@/ts/annotations';
import science from '@/ts/util/science';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const revision = ref( 0 );

export const savedAtRevision = ref( 0 );

export const resetSave = () => {
    revision.value = 0;
    savedAtRevision.value = 0;
};

/** Save manager (i.e. manages saving to backend) */
export const useSaveFunction = () => {
    const session = useAnnotationSessionStore();

    let isSaving = false;
    let saveAgain = false;

    const save = async () => {
        // Lock the saving function
        if ( isSaving ) {
            saveAgain = true;

            return;
        }

        isSaving = true;

        try {
            const data = saveCreator();

            if ( data.status ) {
                try {
                    // Try to save to backend
                    await annotation.save( data.data, session.sessionIds[session.sessionIdx]!.sessionId ).then();
                    science.save();
                    // This is used to track the last saved revision,
                    // which is then used to show to user if saving is needed
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
            } else {
                document.dispatchEvent( new CustomEvent( 'eyetap:save:fail', {
                    'detail': {
                        'reason': 'ERR_DATA_PREP_FAILED',
                        'error': 'Failed to generate the data to save'
                    }
                } ) );
            }

            isSaving = false;

            if ( saveAgain ) {
                saveAgain = false;
                save();
            }
        } catch ( e ) {
            console.error( e );
            isSaving = false;
            saveAgain = false;
        }
    };

    const saveCreator = () => {
        const data: EditAnnotationsDto = {
            'annotations': {},
            'annotationsToRemove': {}
        };

        try {
            const annotationsSnapshot = [ ...annotations.value ];
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
            const diff = createNumberDiff( invalidatedFixations.value, invalidMarked );

            invalidatedFixations.value = invalidMarked;

            data.fixationsToRemove = diff.added;
            data.fixationsToUndoRemove = diff.removed;

            // Store the transmitted annotations to not create a conflict
            userAnnotations.value = annotationsSnapshot;

            return {
                'status': true,
                'data': data
            };
        } catch ( e ) {
            document.dispatchEvent( new CustomEvent( 'eyetap:save:fail', {
                'detail': {
                    'reason': 'ERR_PREPROCESSING',
                    'error': e
                }
            } ) );
        }

        return {
            'status': false,
            'data': data
        };
    };

    /** Save using the browser's sendBeacon function (useful for events such as visibilitychange) */
    const saveWithBeacon = () => {
        const data = saveCreator();

        if (
            data.status
            && ( Object.keys( data.data.annotations! ).length > 0
                || Object.keys( data.data.annotationsToRemove! ).length > 0
                || Object.keys( data.data.fixationsToRemove! ).length > 0
                || Object.keys( data.data.fixationsToUndoRemove! ).length > 0
            )
        ) {
            annotation.autoSaveOnUnload( data.data, session.sessionIds[session.sessionIdx]!.sessionId );
        }
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );

    return saveWithBeacon;
};
