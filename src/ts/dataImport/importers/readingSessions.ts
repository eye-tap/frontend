import {
    importConfigFixationHasMultipleTexts,
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

export const importReadingSession = ( fixationsCSVElement: HTMLInputElement, textId: string ): Promise<ImportReadingSessionDto[]> => {
    return new Promise( ( resolve, reject ) => {
        loadFileFromDiskAsString( fixationsCSVElement )
            .then( pCSV => {
                try {
                    resolve( parseFixationsCSV(
                        pCSV,
                        importConfigFixationHasMultipleTexts.value ? textId : undefined,
                        100,
                        importConfigFixationXCoordCSVName.value,
                        importConfigFixationYCoordCSVName.value,
                        importConfigFixationTextIDCSVName.value
                    ) );
                } catch ( e ) {
                    reject( e );
                }
            } )
            .catch( reject );
    } );
};
