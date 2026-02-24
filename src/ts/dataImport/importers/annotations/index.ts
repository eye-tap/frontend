import {
    type Ref, ref
} from 'vue';
import {
    fixationsMultiplePerFileImporter
} from '../fixations/multiplePerFile';
import {
    fixationsSingleReaderPerFileImporter
} from '../fixations/singlePerFile';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';

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
        // Find best parser based on header
        if ( selectedReadingSessionParserIndex.value > -1 ) {
            return await annotationParsers.value[
                selectedReadingSessionParserIndex.value
            ]!.parse( annotationsCSVElement, textId );
        }

        if ( !annotationsCSVElement.files?.[0] )
            return [];

        const firstFile = annotationsCSVElement.files[0];
        const text = await firstFile.text();
        const header = ( text.split( /\r?\n/ )[0] ?? '' )
            .split( ',' )
            .map( h => h.trim() );
        const parser = annotationParsers.value.find( p => p.canParse?.( header ) );

        if ( !parser )
            throw new Error( 'No suitable parser found.' );

        return await parser.parse( annotationsCSVElement, textId );
    }
};
