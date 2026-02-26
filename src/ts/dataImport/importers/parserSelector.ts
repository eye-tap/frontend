import type {
    ImportConfig
} from '@/types/import';
import {
    NoSuitableParserError
} from '../util/errors';
import type {
    Ref
} from 'vue';

export const selectBestParser = async <T> (
    parsers: Ref<ImportConfig<T[]>[]>,
    selectedIdx: Ref<number>,
    csvElement: HTMLInputElement,
    textId: string,
    lang: string
): Promise<T[]> => {
    if ( selectedIdx.value > -1 ) {
        return await parsers.value[
            selectedIdx.value
        ]!.parse( csvElement, textId, lang );
    }

    if ( !csvElement.files?.[0] )
        return [];

    const firstFile = csvElement.files[0];
    const text = await firstFile.text();
    const header = ( text.split( /\r?\n/ )[0] ?? '' )
        .split( ',' )
        .map( h => h.trim() );
    const parser = parsers.value.find( p => p.canParse?.( header ) );

    if ( !parser )
        throw new NoSuitableParserError( 'No suitable parser found.' );


    console.log( '[Parser selector] Using parser', parser );

    try {
        return await parser.parse( csvElement, textId, lang );
    } catch ( error ) {
        selectedIdx.value = parsers.value.indexOf( parser );

        throw error;
    }
};
