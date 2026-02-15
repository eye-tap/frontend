import {
    importConfigAnnotationBoundingBoxIdCSVName,
    importConfigAnnotationFixationIDCSVName,
    importConfigAnnotationHasMultipleTexts,
    importConfigAnnotationReaderCSVName,
    importConfigAnnotationTextIDCSVName
} from '../util/config';
import type {
    ImportAnnotation
} from '@/types/import-annotation';
import {
    loadFileFromDiskAsString
} from '../util/loadFileFromDisk';
import {
    parseAnnotationsCSV
} from '../parsers/annotations';

export const importAnnotation = async ( annotationCSVElement: HTMLInputElement, textId: string ): Promise<ImportAnnotation> => {
    const aCSV = await loadFileFromDiskAsString( annotationCSVElement );

    return parseAnnotationsCSV(
        aCSV,
        '', // TODO: Put here the title for the machine generated imports
        importConfigAnnotationHasMultipleTexts.value ? textId : undefined,
        importConfigAnnotationTextIDCSVName.value,
        importConfigAnnotationReaderCSVName.value,
        importConfigAnnotationFixationIDCSVName.value,
        importConfigAnnotationBoundingBoxIdCSVName.value
    );
};
