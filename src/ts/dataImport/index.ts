import {
    importReadingSession
} from './importers/fixations';
import {
    importText
} from './importers/text';
import request from '../util/request';
import {
    useNotification
} from '@kyvg/vue3-notification';

export const importDatasetFromCSV = async (
    boundingBoxesCSVInputElement: HTMLInputElement,
    fixationsCSVInputElement: HTMLInputElement,
    annotationsCSVInputElement: HTMLInputElement,
    imageInputElement: HTMLInputElement,
    textId: string,
    textName: string
): Promise<void> => {
    const notifications = useNotification();

    console.debug( '[Bench] Starting import' );
    const importStart = performance.now();
    const text = await importText( imageInputElement, boundingBoxesCSVInputElement, textId, textName );
    // TODO: Pre-annotations import
    const readingSession = await importReadingSession( fixationsCSVInputElement, textId );
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

    const backendProcessingStart = performance.now();

    await request.post( '/import/text', text );
    await request.post( '/import/reading-sessions', readingSession );
    console.debug( '[Bench] Backend processing and networking took', performance.now() - backendProcessingStart, 'ms' );
    console.log( '[Bench] Full import took', performance.now() - importStart, 'ms' );
};

export default {
    importDatasetFromCSV
};
