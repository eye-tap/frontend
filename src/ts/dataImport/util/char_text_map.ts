import {
    InvalidIndexNameError
} from './errors';

export const createUidLookupMap = ( csvText: string, textUidCSVName: string, textIDCSVName: string ): Map<string, string> => {
    const lines = csvText.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const charUid = header.indexOf( textUidCSVName ); // Target for UID lookup
    const textUid = header.indexOf( textIDCSVName ); // global text ID
    const lookup = new Map<string, string>();

    if ( charUid < 0 )
        throw new InvalidIndexNameError( 'Text UID (for association)' );
    else if ( textUid < 0 )
        throw new InvalidIndexNameError( 'Text ID (for association)' );

    lines.forEach( line => {
        const cols = line.split( ',' );

        if ( cols[charUid] !== undefined && cols[textUid] !== undefined ) {
            lookup.set( cols[charUid].trim(), cols[textUid].trim() );
        }
    } );

    return lookup;
};
