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
    loadAllFilesOfElementAsStringWithCallback
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

        const store: ImportPreAnnotationDto[] = [];

        await loadAllFilesOfElementAsStringWithCallback( inputElement, async ( data: string ) => {
            const parsed = mainParser( data, normalAnnotationImporter.options, textId );

            parsed.forEach( val => {
                store.push( val );
            } );
        } );

        return store;
    }
};
