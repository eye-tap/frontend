import type {
    ImportTextDto
} from '@/types/dtos/ImportTextDto';
import {
    importBoundingBoxes
} from './characterBoxes';
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
): Promise<ImportTextDto> => {
    const boundingBoxes = await importBoundingBoxes( boundingBoxesCSV, textId );

    return {
        'title': textName,
        'backgroundImage': uint8ArrayToBase64( await ( await loadFileFromDisk( image ) ).bytes() ),
        'language': 'undefined', // TODO: language selection
        'characterBoundingBoxes': boundingBoxes.characters,
        'wordBoundingBoxes': boundingBoxes.words,
        'foreignId': Number( textId )
    };
};
