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
    fileLoaderString
} from '../../util/fileLoader';

export const normalAnnotationImporter: ImportConfig<ImportPreAnnotationDto[]> = {
    'name': '',
    'options': {
        ...annotationOpts,
        'textid': {
            'display': 'Text ID',
            'value': 'text_id',
            'input': 'string'
        }
    },
    'parse': async ( inputElement: HTMLInputElement, textId: string ): Promise<ImportPreAnnotationDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        return mainParser( await fileLoaderString( inputElement.files[ 0 ] ), normalAnnotationImporter.options, textId );
    }
};
