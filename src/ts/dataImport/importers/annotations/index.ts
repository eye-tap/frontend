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
    normalAnnotationImporter
} from './normalIDs';
import {
    selectBestParser
} from '../parserSelector';
import {
    uidBasedTextAnnotationImporter
} from './uidBasedAssignment';

export const annotationParsers: Ref<ImportConfig<ImportPreAnnotationDto[]>[]> = ref( [
    normalAnnotationImporter,
    uidBasedTextAnnotationImporter
] );

export const selectedAnnotationParserIndex = ref( -1 );

export const importPreAnnotations = async (
    annotationsCSVElement: HTMLInputElement,
    textId: string,
    lang: string
): Promise<ImportPreAnnotationDto[]> => {
    if ( selectedAnnotationParserIndex.value > -1 ) {
        return await annotationParsers.value[ selectedAnnotationParserIndex.value ]!.parse( annotationsCSVElement, textId, lang );
    } else {
        // Find best parser based on header
        return await selectBestParser( annotationParsers, selectedAnnotationParserIndex, annotationsCSVElement, textId, lang );
    }
};
