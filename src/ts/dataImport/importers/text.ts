import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';
import type {
    WordBoundingBoxDto
} from '@/types/dtos/WordBoundingBoxDto';
import {
    importBoundingBoxes
} from './boundingBoxes';
import {
    loadFileFromDisk
} from '../util/loadFileFromDisk';
import {
    uint8ArrayToBase64
} from '../util/converter';

export const importText = (
    image: HTMLInputElement,
    boundingBoxesCSV: HTMLInputElement,
    textId: string
): Promise<{
    'backgroundImage': string,
    'charBB': CharacterBoundingBoxDto[],
    'wordBB': WordBoundingBoxDto[]
}> => {
    return new Promise( ( resolve, reject ) => {
        try {
            importBoundingBoxes( boundingBoxesCSV, textId )
                .then( boundingBoxes => {
                    loadFileFromDisk( image ).then( img => img.bytes()
                        .then( bgImg => {
                            resolve( {
                                'backgroundImage': uint8ArrayToBase64( bgImg ),
                                'charBB': boundingBoxes.characters,
                                'wordBB': boundingBoxes.words
                            } );
                        } ) )
                        .catch( reject );
                } )
                .catch( reject );
        } catch ( e ) {
            console.log( 'error caught in importText' );

            return Promise.reject( e );
        }
    } );
};
