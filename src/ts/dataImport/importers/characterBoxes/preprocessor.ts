import {
    InvalidIndexNameError
} from '../../util/errors';
import type {
    ParserOptsList
} from '@/types/import';


export const boundingBoxesOpts: ParserOptsList<unknown> = {
    'char': {
        'display': 'Character',
        'value': 'character',
        'input': 'string'
    },
    'lang': {
        'display': 'Language',
        'value': 'lang',
        'input': 'string'
    },
    'xMin': {
        'display': 'Lower X Coordiante',
        'value': 'bbox_x1',
        'input': 'string'
    },
    'xMax': {
        'display': 'Higher X Coordinate',
        'value': 'bbox_x2',
        'input': 'string'
    },
    'yMin': {
        'display': 'Lower X Coordinate',
        'value': 'bbox_y1',
        'input': 'string'
    },
    'yMax': {
        'display': 'Higher X Coordinate',
        'value': 'bbox_y2',
        'input': 'string'
    }
};

export const preprocessor = (
    data: string,
    opts: ParserOptsList<unknown>
) => {
    const lines = data.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const charIndex = header.indexOf( opts.char!.value as string );
    const textIndex = opts.textID ? header.indexOf( opts.textID.value as string ) : -1;
    const langIndex = header.indexOf( opts.lang!.value as string );
    const xMinIndex = header.indexOf( opts.xMin!.value as string );
    const xMaxIndex = header.indexOf( opts.xMax!.value as string );
    const yMinIndex = header.indexOf( opts.yMin!.value as string );
    const yMaxIndex = header.indexOf( opts.yMax!.value as string );

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

    return {
        lines,
        charIndex,
        textIndex,
        langIndex,
        xMinIndex,
        xMaxIndex,
        yMinIndex,
        yMaxIndex
    };
};
