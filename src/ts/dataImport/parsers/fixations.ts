import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';

export const parseFixationsCSV = (
    text: string,
    textId?: string,
    factor: number = 100,
    xName: string = 'x',
    yName: string = 'y',
    readerName: string = 'reader',
    textName: string = 'text'
): ImportReadingSessionDto[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( readerName );
    const textIndex = header.indexOf( textName );
    const xIndex = header.indexOf( xName );
    const yIndex = header.indexOf( yName );
    const indices: {
        [key: string]: number
    } = {};
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];
    const points: {
        [key: string]: ImportReadingSessionDto
    } = {};

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );
        const tempx = Number( cols[xIndex] ) * factor;
        const tempy = Number( cols[yIndex] ) * factor;

        if ( firstEncounteredTextID !== cols[ textIndex ] && !textId ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId !== undefined || cols[textIndex] === textId ) {
            const reader = cols[ readerIndex ]!;

            if ( !indices[ reader ] ) {
                indices[ reader ] = 0;
                points[ reader ] = {
                    'textForeignId': Number( textId ),
                    'readerForeignId': Number( reader ),
                    'fixations': []
                };
            }

            points[ reader ]!.fixations!.push( {
                'x': tempx,
                'y': tempy,
                'foreignId': indices[ cols[ readerIndex ]! ]!++
            } );
        }
    }

    return Object.values( points );
};
