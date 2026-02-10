import type {
    TextDto
} from '@/types/dtos/TextDto';
import {
    importBoundingBoxes
} from './boundingBoxes';
import {
    loadFileFromDisk
} from '../util/loadFileFromDisk';
import {
    uint8ArrayToBase64
} from '../util/converter';

export const importText = async (
    image: HTMLInputElement,
    boundingBoxesCSV: HTMLInputElement,
    textId: string,
    textName: string
): Promise<TextDto> => {
    const boundingBoxes = await importBoundingBoxes( boundingBoxesCSV, textId );

    return {
        'id': Number( textId ),
        'title': textName,
        'backgroundImage': uint8ArrayToBase64( await ( await loadFileFromDisk( image ) ).bytes() ),
        'characterBoundingBoxes': boundingBoxes.characters,
        'wordBoundingBoxes': boundingBoxes.words,
        'foreignId': 0
    };
};
