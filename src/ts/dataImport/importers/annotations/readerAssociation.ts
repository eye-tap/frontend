import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';

export const addPreAnnotationsToReadingSessions = (
    readingSessions: ImportReadingSessionDto[],
    preAnnotations: ImportPreAnnotationDto[]
) => {
    const associationIndexing: {
        [fixIdx: number]: number
    } = {};

    // O(k * j) = O(m)
    readingSessions.forEach( ( val, idx ) => {
        if ( val.fixations )
            val.fixations.forEach( fix => {
                associationIndexing[ fix.foreignId! ] = idx;
            } );

        if ( !val.preAnnotations )
            val.preAnnotations = [];
    } );

    // O(m)
    const association: number[] = [];
    const keys = Object.keys( associationIndexing );

    // O(m log m) sort -> Cannot omit because might not be contiguous
    keys.sort();

    // O(m) create faster association
    keys.forEach( val => {
        association.push( associationIndexing[ Number( val ) ]! );
    } );

    // First coordinate algo idx, second reader
    const stateTracking: {
        [reader: number]: number
    }[] = [];

    // O(n) with n = a * b with a number of algos and b number of annotations each
    preAnnotations.forEach( ( ann, idx ) => {
        stateTracking[ idx ] = [];
        ann.annotations!.forEach( val => {
            const reader = association[ val.foreignFixationId! ]!;
            const pa = readingSessions[ reader ]!.preAnnotations!;

            if ( !stateTracking[ idx ]![ reader ] ) {
                stateTracking[ idx ]![ reader ] = pa.length;
                pa.push( {
                    'title': ann.title,
                    'annotations': [ val ]
                } );
            } else {
                pa[ stateTracking[ idx ]![ reader ]! ]!.annotations!.push( val );
            }
        } );
    } );

    return readingSessions;
};
