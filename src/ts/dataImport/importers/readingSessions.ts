import {
    importConfigFixationFixationIDCSVName,
    importConfigFixationHasMultipleTexts,
    importConfigFixationReaderCSVName,
    importConfigFixationTextIDCSVName,
    importConfigFixationXCoordCSVName,
    importConfigFixationYCoordCSVName
} from '../util/config';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    loadFileFromDiskAsString
} from '../util/loadFileFromDisk';
import {
    parseFixationsCSV
} from '../parsers/fixations';

export const importReadingSession = async ( fixationsCSVElement: HTMLInputElement, textId: string ): Promise<ImportReadingSessionDto[]> => {
    const pCSV = await loadFileFromDiskAsString( fixationsCSVElement );

    return parseFixationsCSV(
        pCSV,
        importConfigFixationHasMultipleTexts.value ? textId : undefined,
        100,
        importConfigFixationXCoordCSVName.value,
        importConfigFixationYCoordCSVName.value,
        importConfigFixationReaderCSVName.value,
        importConfigFixationTextIDCSVName.value,
        importConfigFixationFixationIDCSVName.value
    );
};
