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
    xMinName: string = 'x1',
    xMaxName: string = 'x2',
    yMinName: string = 'y2',
    yMaxName: string = 'y1',
    charName: string = 'character',
    textName: string = 'text_id'
): ImportCharacterBoundingBoxDto[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const charIndex = header.indexOf( charName );
    const textIndex = header.indexOf( textName );
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
    else if ( charIndex < 0 )
        throw new InvalidIndexNameError( 'character' );
    else if ( textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    const boxes: ImportCharacterBoundingBoxDto[] = [];
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( firstEncounteredTextID !== cols[ textIndex ] && !textId ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId === undefined || cols[textIndex] === textId ) {
            const x1 = Number( cols[xMinIndex] );
            const x2 = Number( cols[xMaxIndex] );
            const y1 = Number( cols[yMinIndex] );
            const y2 = Number( cols[yMaxIndex] );

            boxes.push( {
                'xMin': x1 < x2 ? x1 : x2,
                'xMax': x1 < x2 ? x2 : x1,
                'yMin': y1 < y2 ? y1 : y2,
                'yMax': y1 < y2 ? y2 : y1,
                'character': String( cols[charIndex] ),
                'foreignId': Number( cols[textIndex] )
            } );
        }
    }

    return boxes;
};
