import {
    type Ref, ref
} from 'vue';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';
import {
    fixationsMultiplePerFileImporter
} from './multiplePerFile';
import {
    fixationsSingleReaderPerFileImporter
} from './singlePerFile';

export const annotationParsers: Ref<ImportConfig<ImportPreAnnotationDto[]>[]> = ref( [
    fixationsSingleReaderPerFileImporter,
    fixationsMultiplePerFileImporter
] );

export const selectedReadingSessionParserIndex = ref( -1 );

export const importPreAnnotations = async (
    annotationsCSVElement: HTMLInputElement,
    textId: string
): Promise<ImportPreAnnotationDto[]> => {
    if ( selectedReadingSessionParserIndex.value > -1 ) {
        return await annotationParsers.value[ selectedReadingSessionParserIndex.value ]!.parse( annotationsCSVElement, textId );
    } else {
        // TODO: Determine best parser
        return [];
    }
};
