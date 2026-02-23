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
    createUidLookupMap
} from '../../util/char_text_map';
import {
    fileLoaderString
} from '../../util/fileLoader';

export const uidBasedTextAnnotationImporter: ImportConfig<ImportPreAnnotationDto[]> = {
    'name': '',
    'options': {
        ...annotationOpts,
        'textuid': {
            'display': 'Text UID',
            'value': 'text_uid',
            'input': 'string'
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
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string ): Promise<ImportPreAnnotationDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        const association = createUidLookupMap(
            await fileLoaderString( uidBasedTextAnnotationImporter.options.association!.value as File ),
            uidBasedTextAnnotationImporter.options.assTextUID!.value as string,
            uidBasedTextAnnotationImporter.options.assTextID!.value as string
        );

        // TODO: Use multi-file importer instead!
        return mainParser(
            await fileLoaderString( inputElement.files[ 0 ] ),
            uidBasedTextAnnotationImporter.options,
            textId,
            association
        );
    }
};
