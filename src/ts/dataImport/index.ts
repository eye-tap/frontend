import {
    importConfigAnnotationBoundingBoxIdCSVName,
    importConfigAnnotationFixationIDCSVName,
    importConfigAnnotationHasMultipleTexts,
    importConfigAnnotationReaderCSVName,
    importConfigAnnotationTextIDCSVName,
    importConfigBBCharacterCSVName,
    importConfigBBHasMultipleTexts,
    importConfigBBTextIDCSVName,
    importConfigBBXmaxCoordCSVName,
    importConfigBBXminCoordCSVName,
    importConfigBBYmaxCoordCSVName,
    importConfigBBYminCoordCSVName,
    importConfigFixationFixationIDCSVName,
    importConfigFixationHasMultipleReaders,
    importConfigFixationHasMultipleTexts,
    importConfigFixationReaderCSVName,
    importConfigFixationTextIDCSVName,
    importConfigFixationXCoordCSVName,
    importConfigFixationYCoordCSVName
} from './util/config';
import {
    importReadingSession
} from './importers/readingSessions';
import {
    importText
} from './importers/text';
import request from '../util/request';

export const importDatasetFromCSV = async (
    boundingBoxesCSVInputElement: HTMLInputElement,
    fixationsCSVInputElement: HTMLInputElement,
    annotationsCSVInputElement: HTMLInputElement,
    imageInputElement: HTMLInputElement,
    textId: string,
    textName: string
): Promise<void> => {
    const text = await importText( imageInputElement, boundingBoxesCSVInputElement, textId, textName );
    const readingSession = await importReadingSession( fixationsCSVInputElement, annotationsCSVInputElement, textId );

    await request.post( '/import/text', text );
    await request.post( '/import/reading-sessions', readingSession );
};

export default {
    importConfigBBXminCoordCSVName,
    importConfigBBXmaxCoordCSVName,
    importConfigBBYminCoordCSVName,
    importConfigBBYmaxCoordCSVName,
    importConfigBBCharacterCSVName,
    importConfigBBTextIDCSVName,
    importConfigBBHasMultipleTexts,
    importConfigFixationXCoordCSVName,
    importConfigFixationYCoordCSVName,
    importConfigFixationReaderCSVName,
    importConfigFixationTextIDCSVName,
    importConfigFixationFixationIDCSVName,
    importConfigFixationHasMultipleTexts,
    importConfigFixationHasMultipleReaders,
    importConfigAnnotationFixationIDCSVName,
    importConfigAnnotationReaderCSVName,
    importConfigAnnotationTextIDCSVName,
    importConfigAnnotationBoundingBoxIdCSVName,
    importConfigAnnotationHasMultipleTexts,
    importDatasetFromCSV
};
