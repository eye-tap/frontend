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
import {
    selectBestParser
} from '../parserSelector';

export const readingSessionParsers: Ref<ImportConfig<ImportReadingSessionDto[]>[]> = ref( [
    fixationsSingleReaderPerFileImporter,
    fixationsMultiplePerFileImporter
] );

export const selectedReadingSessionParserIndex = ref( -1 );

export const importFixations = async (
    fixationsCSVElement: HTMLInputElement,
    textId: string
): Promise<ImportReadingSessionDto[]> => {
    if ( selectedReadingSessionParserIndex.value > -1 ) {
        return await readingSessionParsers.value[ selectedReadingSessionParserIndex.value ]!.parse( fixationsCSVElement, textId );
    } else {
        return await selectBestParser( readingSessionParsers, selectedReadingSessionParserIndex, fixationsCSVElement, textId );
    }
};
