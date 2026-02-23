import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from '../util/errors';
import type {
    ImportCharacterBoundingBoxDto
} from '@/types/dtos/ImportCharacterBoundingBoxDto';

export const parseCharacterBoundingBoxesCSV = (
    text: string,
    textId?: string,
    xMinName: string = 'x_min',
    xMaxName: string = 'x_max',
    yMinName: string = 'y_min',
    yMaxName: string = 'y_max',
    char_text: string = 'char_text',
    char_uid: string = 'char_uid',
    uidLookupMap?: Map<string, string> // MAP for char_uid to text_id
): ImportCharacterBoundingBoxDto[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const charName = header.indexOf( char_text );
    const charId = header.indexOf( char_uid );
    const xMinIndex = header.indexOf( xMinName );
    const xMaxIndex = header.indexOf( xMaxName );
    const yMinIndex = header.indexOf( yMinName );
    const yMaxIndex = header.indexOf( yMaxName );



    if ( xMinIndex < 0 )
        throw new InvalidIndexNameError( 'smaller X coordinate' );
    else if ( xMaxIndex < 0 )
        throw new InvalidIndexNameError( 'larger X coordinate' );
    else if ( yMinIndex < 0 )
        throw new InvalidIndexNameError( 'smaller Y coordinate' );
    else if ( yMaxIndex < 0 )
        throw new InvalidIndexNameError( 'larger Y coordinate' );
    else if ( charName < 0 )
        throw new InvalidIndexNameError( 'character' );
    else if ( charId < 0 )
        throw new InvalidIndexNameError( 'character ID' );

    const boxes: ImportCharacterBoundingBoxDto[] = [];
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ charId ];

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );
        const currentCharUid = cols[charId]!;
        const actualTextId = uidLookupMap ? uidLookupMap.get( currentCharUid ) : currentCharUid;

        if ( firstEncounteredTextID !== currentCharUid && !textId ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId === undefined || actualTextId === textId ) {
            const x1 = Number( cols[xMinIndex] );
            const x2 = Number( cols[xMaxIndex] );
            const y1 = Number( cols[yMinIndex] );
            const y2 = Number( cols[yMaxIndex] );

            boxes.push( {
                'xMin': x1 < x2 ? x1 : x2,
                'xMax': x1 < x2 ? x2 : x1,
                'yMin': y1 < y2 ? y1 : y2,
                'yMax': y1 < y2 ? y2 : y1,
                'character': String( cols[charName] ),
                'foreignId': Number( actualTextId )
            } );
        }
    }



    return boxes;
};
