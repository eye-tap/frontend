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
    MissingFilesError
} from '../../util/errors';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';
import {
    loadAllFilesOfElementAsStringWithCallback
} from '../../util/fileLoader';

export const fixationsSingleReaderPerFileImporter: ImportConfig<ImportReadingSessionDto[]> = {
    'display': 'Single reader per File',
    'options': {
        ...fixationsOpts
    },
    // used for parser selection
    'canParse': ( header: string[] ) => {
        return !header.join( ',' ).includes( 'reader' ) && determineCorrectParserSettings( header, fixationsSingleReaderPerFileImporter );
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string, lang: string ): Promise<ImportReadingSessionDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        const store: ImportReadingSessionDto[] = [];

        await loadAllFilesOfElementAsStringWithCallback( inputElement, async ( data: string ) => {
            // TODO: Get reader from somewhere, how? Have user provide regex?
            const parsed = await runParse( data, textId, '', lang );

            parsed.forEach( val => {
                store.push( val );
            } );
        } );

        return store;
    }
};

const runParse = async ( data: string, textId: string, reader: string, lang: string ): Promise<ImportReadingSessionDto[]> => {
    const conf = preprocessor( data, fixationsSingleReaderPerFileImporter.options );
    const points: {
        [reader: string]: ImportReadingSessionDto
    } = {};
    const addPointForReader = usePointAdder(
        conf,
        fixationsSingleReaderPerFileImporter.options.factor!.value as number,
        points,
        textId,
        lang
    );

    for ( let i = 0; i < conf.lines.length; i++ ) {
        const cols = conf.lines[i]!.split( ',' );

        // Language filtering
        if ( lang === 'undefined' || ( conf.langIndex > -1 ? cols[conf.langIndex]! === lang : true ) ) {
            addPointForReader( reader, cols );
        }
    }

    return Object.values( points );
};
