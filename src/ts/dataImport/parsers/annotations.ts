import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from './errors';
import type {
    ImportAnnotation
} from '@/types/import-annotation';

export const parseAnnotationsCSV = (
    text: string,
    title: string,
    textId?: string,
    textName: string = 'text',
    readerName: string = 'reader',
    fixationName: string = 'fixation',
    boxName: string = 'bb'
): ImportAnnotation => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( readerName );
    const textIndex = header.indexOf( textName );
    const fixIndex = header.indexOf( fixationName );
    const boxIndex = header.indexOf( boxName );

    if ( fixIndex < 0 )
        throw new InvalidIndexNameError( 'X coordinate' );
    else if ( boxIndex < 0 )
        throw new InvalidIndexNameError( 'Y coordinate' );
    else if ( readerIndex < 0 )
        throw new InvalidIndexNameError( 'reader ID' );
    else if ( textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];
    // First index is text, second id is reader
    const annotations: ImportAnnotation = {};

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( firstEncounteredTextID !== cols[ textIndex ] && !textId ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        if ( textId === undefined ) {
            const reader = cols[ readerIndex ]!;

            if ( !annotations[ reader ] ) {
                annotations[ reader ] = {
                    'title': title,
                    'fixationToCharacterBoxForeignIds': {}
                };
            }

            annotations[ reader ].fixationToCharacterBoxForeignIds![ cols[ fixIndex ]! ] = cols[ boxIndex ]!;
        } else if ( cols[ textIndex ] === textId ) {
            const reader = cols[ readerIndex ]!;

            if ( !annotations[ reader ] ) {
                annotations[ reader ] = {
                    'title': title,
                    'fixationToCharacterBoxForeignIds': {}
                };
            }

            annotations[ reader ].fixationToCharacterBoxForeignIds![ cols[ fixIndex ]! ] = cols[ boxIndex ]!;
        }
    }

    return annotations;
};
