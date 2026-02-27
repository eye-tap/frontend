import {
    InvalidIndexNameError,
    MissingFilesError
} from '../../util/errors';
import {
    fixationsOpts,
    preprocessor,
    usePointAdder
} from './util';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';
import {
    fileLoaderString
} from '../../util/fileLoader';

export const fixationsMultiplePerFileImporter: ImportConfig<ImportReadingSessionDto[]> = {
    'display': 'Multiple readers in a file',
    'options': {
        ...fixationsOpts,
        'reader': {
            'display': 'Reader',
            'value': 'reader',
            'input': 'string',
            'searchTerms': [ 'reader' ]
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string, lang ): Promise<ImportReadingSessionDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        return runParse( await fileLoaderString( inputElement.files[ 0 ] ), textId, lang );
    },

    // used for parser selection
    'canParse': ( header: string[], fileCount: number ) => {
        return fileCount === 1 && determineCorrectParserSettings( header, fixationsMultiplePerFileImporter );
    }
};

const runParse = async ( data: string, textId: string, lang: string ): Promise<ImportReadingSessionDto[]> => {
    const conf = preprocessor( data, fixationsMultiplePerFileImporter.options );

    if ( conf.textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    const points: {
        [reader: string]: ImportReadingSessionDto
    } = {};
    const addPointForReader = usePointAdder( conf, fixationsMultiplePerFileImporter.options.factor!.value as number, points, textId, lang );

    for ( let i = 0; i < conf.lines.length; i++ ) {
        const cols = conf.lines[i]!.split( ',' );

        // Language filtering
        if ( lang === 'undefined' || ( conf.langIndex > -1 ? cols[conf.langIndex]! === lang : true ) ) {
            if ( cols[conf.textIndex] === textId ) {
                addPointForReader( cols[ conf.readerIndex ]!, cols );
            }
        }
    }

    return Object.values( points );
};
