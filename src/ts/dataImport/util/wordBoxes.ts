import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';
import type {
    ImportWordBoundingBoxDto
} from '@/types/dtos/ImportWordBoundingBoxDto';


interface WordParserStore {
    'xMin': number;
    'xMax': number;
    'yMin': number;
    'yMax': number;
    'word': string;
}

const wordStoreTemplate: WordParserStore = {
    'xMin': 0,
    'xMax': 0,
    'yMin': 0,
    'yMax': 0,
    'word': ''
};


export const generateWordBoxesFromCharacterBoxes = ( characterBoundingBoxes: CharacterBoundingBoxDto[] ): ImportWordBoundingBoxDto[] => {
    const boxes: ImportWordBoundingBoxDto[] = [];

    let index = 0;
    let currentWord = {
        ...wordStoreTemplate
    };

    for ( let i = 0; i < characterBoundingBoxes.length; i++ ) {
        const cbb = characterBoundingBoxes[ i ]!;

        if ( cbb.character === ' ' || cbb.character === '' ) {
            boxes.push( {
                ...currentWord,
                'foreignId': index
            } );
            index++;
            currentWord = {
                ...wordStoreTemplate
            };
        } else {
            currentWord.word += cbb.character;

            if ( cbb.xMin! < currentWord.xMin ) currentWord.xMin = cbb.xMin!;

            if ( cbb.xMax! > currentWord.xMax ) currentWord.xMax = cbb.xMax!;

            if ( cbb.yMin! < currentWord.yMin ) currentWord.yMin = cbb.yMin!;

            if ( cbb.yMax! > currentWord.yMax ) currentWord.yMax = cbb.yMax!;
        }
    }

    return boxes;
};
