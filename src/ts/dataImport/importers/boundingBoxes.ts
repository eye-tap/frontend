import {
    importConfigBBCharacterCSVName,
    importConfigBBHasMultipleTexts,
    importConfigBBTextIDCSVName,
    importConfigBBXmaxCoordCSVName,
    importConfigBBXminCoordCSVName,
    importConfigBBYmaxCoordCSVName,
    importConfigBBYminCoordCSVName
} from '../util/config';
import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';
import type {
    WordBoundingBoxDto
} from '@/types/dtos/WordBoundingBoxDto';
import {
    generateWordBoxesFromCharacterBoxes
} from '../parsers/wordBoxes';
import {
    loadFileFromDiskAsString
} from '../util/loadFileFromDisk';
import {
    parseCharacterBoundingBoxesCSV
} from '../parsers/characterBoxes';

export const importBoundingBoxes = async ( boundingBoxesCSVElement: HTMLInputElement, textId: string ): Promise<{
    'characters': CharacterBoundingBoxDto[],
    'words': WordBoundingBoxDto[]
}> => {
    const bbCSV = await loadFileFromDiskAsString( boundingBoxesCSVElement );
    const cbb = parseCharacterBoundingBoxesCSV(
        bbCSV,
        importConfigBBHasMultipleTexts.value ? textId : undefined,
        importConfigBBXminCoordCSVName.value,
        importConfigBBXmaxCoordCSVName.value,
        importConfigBBYminCoordCSVName.value,
        importConfigBBYmaxCoordCSVName.value,
        importConfigBBCharacterCSVName.value,
        importConfigBBTextIDCSVName.value
    );

    return {
        'characters': cbb,
        'words': generateWordBoxesFromCharacterBoxes( cbb )
    };
};
