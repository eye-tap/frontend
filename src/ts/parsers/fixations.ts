import type {
    Fixation
} from '@/editor/types/fixations';
import {
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';

export const parseFixationsCSV = (
    text: string,
    textId?: string,
    factor: number = 100,
    xName: string = 'x',
    yName: string = 'y',
    // annotatedName: string = 'annotatedbox',
    readerName: string = 'reader',
    textName: string = 'text'
): Fixation[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( readerName );
    const textIndex = header.indexOf( textName );
    const xIndex = header.indexOf( xName );
    const yIndex = header.indexOf( yName );
    // const annotatedIndex = header.indexOf( annotatedName );
    const indices: {
        [key: string]: number
    } = {};
    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];
    const points: Fixation[] = [];

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );
        const tempx = Number( cols[xIndex] ) * factor;
        const tempy = Number( cols[yIndex] ) * factor;

        // let annotatedValue = null;

        if ( firstEncounteredTextID !== cols[ textIndex ] ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        // TODO: Decide if we need this
        // if ( annotatedIndex !== -1 ) {
        //     const raw = cols[annotatedIndex]?.trim();
        //
        //     if ( raw !== '' && raw !== undefined ) {
        //         annotatedValue = isNaN( Number( raw ) ) ? raw : Number( raw );
        //     }
        // }


        if ( textId !== undefined || cols[textIndex] === textId ) {
            if ( !indices[ cols[ readerIndex ]! ] ) indices[ cols[ readerIndex ]! ] = 0;

            points.push( {
                'reader': Number( cols[ readerIndex ] ),
                'x': tempx,
                'y': tempy,
                'id': indices[ cols[ readerIndex ]! ]!++
            } );
        }
    }

    return points;
};
