import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';
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
    let index = 0;

    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const charIndex = header.indexOf( charName );
    const textIndex = header.indexOf( textName );

    let xMinIndex = header.indexOf( xMinName );
    let xMaxIndex = header.indexOf( xMaxName );
    let yMinIndex = header.indexOf( yMinName );
    let yMaxIndex = header.indexOf( yMaxName );

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

    // Make sure the order is actually correct
    if ( firstCols[ yMaxIndex ]! < firstCols[ yMinIndex ]! ) {
        const temp = yMaxIndex;

        yMaxIndex = yMinIndex;
        yMinIndex = temp;
    }

    if ( firstCols[ xMaxIndex ]! < firstCols[ xMinIndex ]! ) {
        const temp = xMaxIndex;

        xMaxIndex = xMinIndex;
        xMinIndex = temp;
    }

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
                'foreignId': index++
            } );
    }

    return boxes;
};
