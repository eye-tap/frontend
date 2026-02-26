import {
    type Ref, ref
} from 'vue';
import type {
    ImportCharacterBoundingBoxDto
} from '@/types/dtos/ImportCharacterBoundingBoxDto';
import type {
    ImportConfig
} from '@/types/import';
import type {
    ImportWordBoundingBoxDto
} from '@/types/dtos/ImportWordBoundingBoxDto';
import {
    characterBoxMultipleTextImporter
} from './multipleTextsPerFile';
import {
    characterBoxSingleTextImporter
} from './singleTextPerFile';
import {
    generateWordBoxesFromCharacterBoxes
} from '../../util/wordBoxes';
import {
    selectBestParser
} from '../parserSelector';

export const characterBoxParsers: Ref<ImportConfig<ImportCharacterBoundingBoxDto[]>[]> = ref( [
    characterBoxSingleTextImporter,
    characterBoxMultipleTextImporter
] );

export const selectedCharacterBoxParserIndex = ref( -1 );

export const importBoundingBoxes = async ( boundingBoxesCSVElement: HTMLInputElement, textId: string, lang: string ): Promise<{
    'characters': ImportCharacterBoundingBoxDto[],
    'words': ImportWordBoundingBoxDto[],
}> => {
    let cbb: ImportCharacterBoundingBoxDto[] = [];

    if ( selectedCharacterBoxParserIndex.value > -1 ) {
        cbb = await characterBoxParsers.value[ selectedCharacterBoxParserIndex.value ]!.parse( boundingBoxesCSVElement, textId, lang );
    } else {
        cbb = await selectBestParser( characterBoxParsers, selectedCharacterBoxParserIndex, boundingBoxesCSVElement, textId, lang );
    }

    return {
        'characters': cbb,
        'words': generateWordBoxesFromCharacterBoxes( cbb )
    };
};
