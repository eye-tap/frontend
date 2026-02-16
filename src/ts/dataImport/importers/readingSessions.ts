import {
    fileLoader,
    loadFileFromDiskAsString
} from '../util/loadFileFromDisk';
import {
    importConfigFixationFixationIDCSVName,
    importConfigFixationHasMultipleTexts,
    importConfigFixationReaderCSVName,
    importConfigFixationTextIDCSVName,
    importConfigFixationXCoordCSVName,
    importConfigFixationYCoordCSVName
} from '../util/config';
import type {
    ImportAnnotation
} from '@/types/import-annotation';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    importAnnotation
} from './annotations';
import {
    parseFixationsCSV
} from '../parsers/fixations';

export const importReadingSession = async (
    fixationsCSVElement: HTMLInputElement,
    annotationsCSVElement: HTMLInputElement,
    textId: string
): Promise<ImportReadingSessionDto[]> => {
    const pCSV = await loadFileFromDiskAsString( fixationsCSVElement );
    const fix = parseFixationsCSV(
        pCSV,
        importConfigFixationHasMultipleTexts.value ? textId : undefined,
        100,
        importConfigFixationXCoordCSVName.value,
        importConfigFixationYCoordCSVName.value,
        importConfigFixationReaderCSVName.value,
        importConfigFixationTextIDCSVName.value,
        importConfigFixationFixationIDCSVName.value
    );
    const files = annotationsCSVElement.files;

    if ( files ) {
        for ( let i = 0; i < files.length; i++ ) {
            const data = await ( await fileLoader( files[i]! ) ).text();
            const parsed = await importAnnotation( data, textId, files[i]!.name );

            addPreAnnotationsToReadingSession( fix, parsed, textId );
        }
    }

    return fix;
};

const addPreAnnotationsToReadingSession = ( sessions: ImportReadingSessionDto[], annotations: ImportAnnotation, textId: string ) => {
    Object.keys( annotations ).forEach( reader => {
        for ( let i = 0; i < sessions.length; i++ ) {
            const session = sessions[ i ]!;

            if ( session.textForeignId! === Number( textId ) && session.readerForeignId! === Number( reader ) ) {
                if ( !session.preAnnotations ) session.preAnnotations = [];

                session.preAnnotations.push( annotations[ reader ]! );
            }
        }
    } );
};
