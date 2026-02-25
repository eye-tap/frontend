import {
    InvalidIndexNameError,
    MissingFilesError
} from '../../util/errors';
import {
    boundingBoxesOpts,
    preprocessor
} from './preprocessor';
import type {
    ImportCharacterBoundingBoxDto
} from '@/types/dtos/ImportCharacterBoundingBoxDto';
import type {
    ImportConfig
} from '@/types/import';
import {
    currentTextLang
} from '.';
import {
    fileLoaderString
} from '../../util/fileLoader';

export const characterBoxMultipleTextImporter: ImportConfig<ImportCharacterBoundingBoxDto[]> = {
    'display': 'Multiple Texts per file',
    'options': {
        ...boundingBoxesOpts,
        'textID': {
            'display': 'Text ID',
            'value': 'text_id',
            'input': 'string'
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string ): Promise<ImportCharacterBoundingBoxDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        return runParse( await fileLoaderString( inputElement.files[ 0 ] ), textId );
    }
};

const runParse = async ( data: string, textId: string ): Promise<ImportCharacterBoundingBoxDto[]> => {
    const conf = preprocessor( data, characterBoxMultipleTextImporter.options );
    const boxes: ImportCharacterBoundingBoxDto[] = [];

    if ( conf.textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    for ( let i = 0; i < conf.lines.length; i++ ) {
        const cols = conf.lines[i]!.split( ',' );

        if ( cols[conf.textIndex] === textId ) {
            currentTextLang.lang = conf.langIndex > -1 ? cols[conf.langIndex]! : 'undefined';
            const x1 = Number( cols[conf.xMinIndex] );
            const x2 = Number( cols[conf.xMaxIndex] );
            const y1 = Number( cols[conf.yMinIndex] );
            const y2 = Number( cols[conf.yMaxIndex] );

            boxes.push( {
                'xMin': x1 < x2 ? x1 : x2,
                'xMax': x1 < x2 ? x2 : x1,
                'yMin': y1 < y2 ? y1 : y2,
                'yMax': y1 < y2 ? y2 : y1,
                'character': String( cols[conf.charIndex] ),
                'foreignId': Number( cols[conf.textIndex] )
            } );
        }
    }

    return boxes;
};
