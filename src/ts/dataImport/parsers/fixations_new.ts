import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from '../util/errors';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';

export const parseFixationsCSV = (
    text: string,
    textId: string,
    fileHasMultipleTextIDs: boolean,
    fileHasMultipleReaderIDs: boolean,
    currentReader: string = '0', // only used if fileHasMultipleReaderIDs = false
    factor: number = 100,
    xName: string = 'x',
    yName: string = 'y',
    readerName: string = 'reader',
    textName: string = 'text',
    idName: string = 'fixid',
    // lang: string ='lang'
): ImportReadingSessionDto[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( readerName );
    const textIndex = header.indexOf( textName );
    const xIndex = header.indexOf( xName );
    const yIndex = header.indexOf( yName );
    const idIndex = header.indexOf( idName );
    // const language = header.indexOf( lang );

    if ( xIndex < 0 )
        throw new InvalidIndexNameError( 'X coordinate' );
    else if ( yIndex < 0 )
        throw new InvalidIndexNameError( 'Y coordinate' );
    else if ( readerIndex < 0 && fileHasMultipleReaderIDs )
        throw new InvalidIndexNameError( 'reader ID' );
    else if ( textIndex < 0 && fileHasMultipleTextIDs )
        throw new InvalidIndexNameError( 'text ID' );
    else if ( idIndex < 0 )
        throw new InvalidIndexNameError( 'fixation ID' );

    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];
    const points: {
        [reader: string]: ImportReadingSessionDto
    } = {};

    const addPointForReader = ( cols: string[] ) => {
        const reader = fileHasMultipleReaderIDs ? cols[ readerIndex ]! : currentReader;
        const tempx = Math.round( Number( cols[xIndex] ) * factor );
        const tempy = Math.round( Number( cols[yIndex] ) * factor );

        if ( !points[ reader ] ) {
            points[ reader ] = {
                'textForeignId': Number( textId ),
                'readerForeignId': Number( reader ),
                'fixations': [],
                'preAnnotations': []
            };
        }

        points[ reader ]!.fixations!.push( {
            'x': tempx,
            'y': tempy,
            'foreignId': Number( cols[ idIndex ]! )
        } );
    };

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( !fileHasMultipleTextIDs ) {
            if ( firstEncounteredTextID !== cols[ textIndex ] ) {
                throw new MultipleTextIDsWithoutSpecifiedTextIDError();
            }

            addPointForReader( cols );
        } else if ( cols[textIndex] === textId ) {
            addPointForReader( cols );
        }
    }

    return Object.values( points );
};
