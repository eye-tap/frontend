import {
    boundingBoxesOpts,
    preprocessor
} from './util';
import type {
    ImportCharacterBoundingBoxDto
} from '@/types/dtos/ImportCharacterBoundingBoxDto';
import type {
    ImportConfig
} from '@/types/import';
import {
    MissingFilesError
} from '../../util/errors';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';
import {
    fileLoaderString
} from '../../util/fileLoader';

export const characterBoxSingleTextImporter: ImportConfig<ImportCharacterBoundingBoxDto[]> = {
    'display': 'Single Text per File',
    'options': {
        ...boundingBoxesOpts
    },
    'parse': async ( inputElement: HTMLInputElement, _textId: string, lang: string ): Promise<ImportCharacterBoundingBoxDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        return runParse( await fileLoaderString( inputElement.files[ 0 ] ), lang );
    },
    'canParse': ( header: string[] ) => {
        return !header.join( ',' ).includes( 'text' ) && determineCorrectParserSettings( header, characterBoxSingleTextImporter );
    }
};

const runParse = async ( data: string, lang: string ): Promise<ImportCharacterBoundingBoxDto[]> => {
    const conf = preprocessor( data, characterBoxSingleTextImporter.options );
    const boxes: ImportCharacterBoundingBoxDto[] = [];

    for ( let i = 0; i < conf.lines.length; i++ ) {
        const cols = conf.lines[i]!.split( ',' );

        if ( lang === 'undefined' || ( conf.langIndex > -1 ? cols[conf.langIndex]! === lang : true ) ) {
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
