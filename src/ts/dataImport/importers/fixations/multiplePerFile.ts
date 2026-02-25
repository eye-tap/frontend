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
    fileLoaderString
} from '../../util/fileLoader';

export const fixationsMultiplePerFileImporter: ImportConfig<ImportReadingSessionDto[]> = {
    'display': 'Multiple readers in a file',
    'options': {
        ...fixationsOpts,
        'textID': {
            'input': 'string',
            'value': 'text',
            'display': 'Text ID'
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string ): Promise<ImportReadingSessionDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        return runParse( await fileLoaderString( inputElement.files[ 0 ] ), textId );
    },

    // used for parser selection
    'canParse': ( header: string[] ) => {
        return header.includes( 'reader' );
    }
};

const runParse = async ( data: string, textId: string ): Promise<ImportReadingSessionDto[]> => {
    const conf = preprocessor( data, fixationsMultiplePerFileImporter.options );

    if ( conf.textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    const lang = fixationsMultiplePerFileImporter.options.lang!.value;
    const points: {
        [reader: string]: ImportReadingSessionDto
    } = {};
    const addPointForReader = usePointAdder( conf, fixationsMultiplePerFileImporter.options.factor!.value as number, points, textId );

    for ( let i = 0; i < conf.lines.length; i++ ) {
        const cols = conf.lines[i]!.split( ',' );

        // Language filtering
        if ( lang || cols[ conf.langIndex ] === lang ) {
            if ( cols[conf.textIndex] === textId ) {
                addPointForReader( cols[ conf.readerIndex ]!, cols );
            }
        }
    }

    return Object.values( points );
};
