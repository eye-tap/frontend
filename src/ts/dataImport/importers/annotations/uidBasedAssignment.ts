import {
    annotationOpts,
    mainParser
} from './util';
import {
    fileLoaderString,
    loadAllFilesOfElementAsStringWithCallback
} from '../../util/fileLoader';
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
    createUidLookupMap
} from '../../util/char_text_map';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';

export const uidBasedTextAnnotationImporter: ImportConfig<ImportPreAnnotationDto[]> = {
    'display': 'Text UID based reverse association',
    'options': {
        ...annotationOpts,
        'textuid': {
            'display': 'Text UID',
            'value': 'text_uid',
            'input': 'string',
            'searchTerms': [
                'text_uid',
                'textuid'
            ]
        },
        'association': {
            'display': 'Text to generate associations from', // TODO: Update name, this is for texts.csv file
            'value': null,
            'input': 'file'
        },
        'assTextUID': {
            'display': 'Text UID', // TODO: Update name, this is for texts.csv file
            'value': 'text_uid',
            'input': 'string'
        },
        'assTextID': {
            'display': 'Text ID', // TODO: Update name, this is for texts.csv file
            'value': 'text_id',
            'input': 'string'
        },
        'assLang': {
            'display': 'Language', // TODO: Update name, this is for texts.csv file
            'value': 'lang',
            'input': 'string'
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string, lang ): Promise<ImportPreAnnotationDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        if ( !uidBasedTextAnnotationImporter.options.association!.value )
            throw new MissingFilesError();

        const association = createUidLookupMap(
            await fileLoaderString( uidBasedTextAnnotationImporter.options.association!.value as File ),
            uidBasedTextAnnotationImporter.options.assTextUID!.value as string,
            uidBasedTextAnnotationImporter.options.assTextID!.value as string
        );
        const store: ImportPreAnnotationDto[] = [];

        await loadAllFilesOfElementAsStringWithCallback( inputElement, async ( data: string ) => {
            const parsed = mainParser(
                data,
                uidBasedTextAnnotationImporter.options,
                textId,
                lang,
                association
            );

            parsed.forEach( val => {
                store.push( val );
            } );
        } );

        return store;
    },
    'canParse': ( header: string[] ) => {
        return determineCorrectParserSettings( header, uidBasedTextAnnotationImporter );
    }
};
