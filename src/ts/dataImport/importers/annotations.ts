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
    parseAnnotationsCSV
} from '../parsers/annotations';

export const importAnnotation = async ( text: string, textId: string, algoName: string ): Promise<ImportAnnotation> => {
    return parseAnnotationsCSV(
        text,
        algoName,
        importConfigAnnotationHasMultipleTexts.value ? textId : undefined,
        importConfigAnnotationTextIDCSVName.value,
        importConfigAnnotationReaderCSVName.value,
        importConfigAnnotationFixationIDCSVName.value,
        importConfigAnnotationBoundingBoxIdCSVName.value
    );
};
