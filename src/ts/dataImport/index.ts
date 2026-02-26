import {
    importReadingSession
} from './importers/readingSessions';
import {
    importText
} from './importers/text';
import request from '../util/request';
import {
    useNotification
} from '@kyvg/vue3-notification';

export class ImportError extends Error {}

export const importDatasetFromCSV = async (
    boundingBoxesCSVInputElement: HTMLInputElement,
    fixationsCSVInputElement: HTMLInputElement,
    annotationsCSVInputElement: HTMLInputElement,
    imageInputElement: HTMLInputElement,
    textId: string,
    textName: string,
    lang: string
): Promise<void> => {
    const notifications = useNotification();

    console.debug( '[Bench] Starting import' );
    const importStart = performance.now();
    const language = lang === '' ? 'undefined' : lang;
    const text = await importText( imageInputElement, boundingBoxesCSVInputElement, textId, textName, language );
    const readingSession = await importReadingSession( fixationsCSVInputElement, annotationsCSVInputElement, textId, language );
    const loadTime = performance.now() - importStart;

    console.debug( '[Bench] Parsing took', loadTime, 'ms' );
    console.debug( '[Bench] Starting upload' );

    if ( loadTime > 750 )
        setTimeout( () => {
            notifications.notify( {
                'text': 'Completing the import may still take some time. Estimate >' + ( ( loadTime * 5 ) / 1000 ) + 's',
                'type': 'warn',
                'title': 'Importing'
            } );
        }, 2000 );

    console.log( text, readingSession );
    const backendProcessingStart = performance.now();

    try {
        if ( !( await request.post( '/import/text', text ) ).ok ) throw new ImportError( 'Text Import Failed' );
    } catch ( error ) {
        console.error( error );

        throw new ImportError( 'Text Import Failed' );
    }

    try {
        if ( !( await request.post( '/import/reading-sessions', readingSession ) ).ok ) throw new ImportError( 'Reading Session Import Failed' );
    } catch ( error ) {
        console.error( error );

        throw new ImportError( 'Reading Session Import Failed' );
    }

    console.debug( '[Bench] Backend processing and networking took', performance.now() - backendProcessingStart, 'ms' );
    console.log( '[Bench] Full import took', performance.now() - importStart, 'ms' );
};

export default {
    importDatasetFromCSV
};
