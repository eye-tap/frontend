import {
    annotationOpts,
    mainParser
} from './util';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';
import {
    MissingFilesError
} from '../../util/errors';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';
import {
    loadAllFilesOfElementAsStringWithCallback
} from '../../util/fileLoader';

export const normalAnnotationImporter: ImportConfig<ImportPreAnnotationDto[]> = {
    'display': 'Normal', // TODO: Descriptions here and in others
    'desc': '',
    'options': {
        ...annotationOpts,
        'textid': {
            'display': 'Text ID',
            'value': 'text_id',
            'input': 'string',
            'searchTerms': [ 'text' ]
        },
        'lang': {
            'display': 'Language',
            'value': 'lang',
            'input': 'string',
            'searchTerms': [ 'lang' ],
            'optional': true
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string, lang ): Promise<ImportPreAnnotationDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        const store: ImportPreAnnotationDto[] = [];

        await loadAllFilesOfElementAsStringWithCallback( inputElement, async ( data: string ) => {
            const parsed = mainParser( data, normalAnnotationImporter.options, textId, lang );

            parsed.forEach( val => {
                store.push( val );
            } );
        } );

        return store;
    },
    'canParse': ( header: string[] ) => {
        return !header.includes( 'text_uid' ) && determineCorrectParserSettings( header, normalAnnotationImporter );
    }
};
