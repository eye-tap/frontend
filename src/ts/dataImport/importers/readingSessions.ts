import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    addPreAnnotationsToReadingSessions
} from './annotations/readerAssociation';
import {
    importFixations
} from './fixations';
import {
    importPreAnnotations
} from './annotations';


export const importReadingSession = async (
    fixationsCSVElement: HTMLInputElement,
    annotationsCSVElement: HTMLInputElement,
    textId: string
): Promise<ImportReadingSessionDto[]> => {
    const fix = await importFixations( fixationsCSVElement, textId );
    const annotations = await importPreAnnotations( annotationsCSVElement, textId );

    return addPreAnnotationsToReadingSessions( fix, annotations );
};
