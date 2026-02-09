import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';
import type {
    CharacterBoundingBox
} from '@/editor/types/boxes';

export const parseBoundingBoxesCSV = (
    text: string,
    textId?: string,
    xMinName: string = 'x1',
    xMaxName: string = 'x2',
    yMinName: string = 'y1',
    yMaxName: string = 'y2',
    charName: string = 'character',
    textName: string = 'text_id'
): CharacterBoundingBox[] => {
    let index = -1;

    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const xMinIndex = header.indexOf( xMinName );
    const xMaxIndex = header.indexOf( xMaxName );
    const yMinIndex = header.indexOf( yMinName );
    const yMaxIndex = header.indexOf( yMaxName );
    const charIndex = header.indexOf( charName );
    const textIndex = header.indexOf( textName );

    if ( xMinIndex < 0 || xMaxIndex < 0 || yMinIndex < 0 || yMaxIndex < 0 || charIndex < 0 || textIndex < 0 )
        throw new InvalidIndexNameError();

    const boxes: CharacterBoundingBox[] = [];
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( firstEncounteredTextID !== cols[ textIndex ] ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId !== undefined || cols[textIndex] === textId )
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
