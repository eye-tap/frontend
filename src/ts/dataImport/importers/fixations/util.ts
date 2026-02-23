import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    InvalidIndexNameError
} from '../../util/errors';
import type {
    ParserOptsList
} from '@/types/import';

interface FixationsCSVIndices {
    'lines': string[];
    'readerIndex': number;
    'textIndex': number;
    'xIndex': number;
    'yIndex': number;
    'idIndex': number;
    'langIndex': number;
}

export const fixationsOpts: ParserOptsList<unknown> = {
    'x': {
        'display': 'X coordinate',
        'value': 'x',
        'input': 'string'
    },
    'y': {
        'display': 'Y coordinate',
        'value': 'y',
        'input': 'string'
    },
    'reader': {
        'display': 'Reader',
        'value': 'reader',
        'input': 'string'
    },
    'id': {
        'display': 'Fixation ID',
        'value': 'fixid',
        'input': 'string'
    },
    'lang': {
        'display': 'Language',
        'value': 'lang',
        'input': 'string'
    },
    'factor': {
        'display': 'Factor',
        'value': 0,
        'input': 'number'
    }
};

export const preprocessor = (
    data: string,
    opts: ParserOptsList<unknown>
): FixationsCSVIndices => {
    const lines = data.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( opts.reader!.value as string );
    const textIndex = opts.textID ? header.indexOf( opts.textID!.value as string ) : -1;
    const xIndex = header.indexOf( opts.x!.value as string );
    const yIndex = header.indexOf( opts.y!.value as string );
    const idIndex = header.indexOf( opts.id!.value as string );
    const langIndex = header.indexOf( opts.lang!.value as string );

    if ( xIndex < 0 )
        throw new InvalidIndexNameError( 'X coordinate' );
    else if ( yIndex < 0 )
        throw new InvalidIndexNameError( 'Y coordinate' );
    else if ( idIndex < 0 )
        throw new InvalidIndexNameError( 'fixation ID' );

    return {
        lines,
        readerIndex,
        textIndex,
        xIndex,
        yIndex,
        idIndex,
        langIndex
    };
};

export const usePointAdder = (
    indices: FixationsCSVIndices,
    factor: number,
    points: {
        [key: string]: ImportReadingSessionDto
    },
    textId: string
) => {
    return (
        reader: string,
        cols: string[]
    ) => {
        const tempx = Math.round( Number( cols[indices.xIndex] ) * factor );
        const tempy = Math.round( Number( cols[indices.yIndex] ) * factor );

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
            'foreignId': Number( cols[ indices.idIndex ]! )
        } );
    };
};
