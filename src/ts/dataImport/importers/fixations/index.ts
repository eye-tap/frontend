import {
    type Ref, ref
} from 'vue';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportReadingSessionDto
} from '@/types/dtos/ImportReadingSessionDto';
import {
    fixationsMultiplePerFileImporter
} from './multiplePerFile';
import {
    fixationsSingleReaderPerFileImporter
} from './singlePerFile';

export const readingSessionParsers: Ref<ImportConfig<ImportReadingSessionDto[]>[]> = ref( [
    fixationsSingleReaderPerFileImporter,
    fixationsMultiplePerFileImporter
] );

// TODO: Set to -1 as soon as best parser selection is implemented
export const selectedReadingSessionParserIndex = ref( 1 );

export const importReadingSession = async (
    boundingBoxesCSVElement: HTMLInputElement,
    textId: string
): Promise<ImportReadingSessionDto[]> => {
    if ( selectedReadingSessionParserIndex.value > -1 ) {
        return await readingSessionParsers.value[ selectedReadingSessionParserIndex.value ]!.parse( boundingBoxesCSVElement, textId );
    } else {
        // TODO: Determine best parser
        return [];
    }
};
