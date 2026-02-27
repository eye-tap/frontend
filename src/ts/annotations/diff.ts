import type {
    EditorAnnotation
} from '@/editor/types/annotation';

export const createDiff = ( old: EditorAnnotation[], updated: EditorAnnotation[] ) => {
    const added: EditorAnnotation[] = [];
    const removed = [ ...old ];

    let offset = 0;

    updated.forEach( ( val, idx ) => {
        for ( let i = 0; i < old.length; i++ ) {
            const el = old[i]!;

            if ( el.boxIdx === val.boxIdx && el.fixationIdx === val.fixationIdx ) {
                removed.splice( idx - offset, 1 );
                offset++;

                return;
            }
        }

        added.push( val );
    } );

    return {
        'added': added,
        'removed': removed
    };
};

export const createNumberDiff = ( old: number[], updated: number[] ) => {
    const added: number[] = [];
    const removed = [ ...old ];

    let offset = 0;

    updated.forEach( ( val, idx ) => {
        if ( old.includes( val ) ) {
            removed.splice( idx - offset, 1 );
            offset++;
        } else {
            added.push( val );
        }
    } );

    return {
        'added': added,
        'removed': removed
    };
};
