import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';
import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';

export const parseCharacterBoundingBoxesCSV = (
    text: string,
    textId?: string,
    xMinName: string = 'x1',
    xMaxName: string = 'x2',
    yMinName: string = 'y1',
    yMaxName: string = 'y2',
    charName: string = 'character',
    textName: string = 'text_id'
): CharacterBoundingBoxDto[] => {
    let index = 0;

    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const xMinIndex = header.indexOf( xMinName );
    const xMaxIndex = header.indexOf( xMaxName );
    const yMinIndex = header.indexOf( yMinName );
    const yMaxIndex = header.indexOf( yMaxName );
    const charIndex = header.indexOf( charName );
    const textIndex = header.indexOf( textName );

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

    const boxes: CharacterBoundingBoxDto[] = [];
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( firstEncounteredTextID !== cols[ textIndex ] && !textId ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId === undefined || cols[textIndex] === textId )
            boxes.push( {
                'xMin': Number( cols[xMinIndex] ),
                'xMax': Number( cols[xMaxIndex] ),
                'yMin': Number( cols[yMinIndex] ),
                'yMax': Number( cols[yMaxIndex] ),
                'character': String( cols[charIndex] ),
                'id': index++
            } );
    }

    return boxes;
};
