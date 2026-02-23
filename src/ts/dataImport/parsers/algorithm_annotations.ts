import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from '../util/errors';
import type {
    ImportAnnotation
} from '@/types/import-annotation';
import type {
    PreAnnotationValueDto
} from '@/types/dtos/PreAnnotationValueDto';

export const parseAlgorithmAnnotationsCSV = (
    text: string,
    title: string,
    textFilter: undefined | string | [number, number] | number[],
    textName: string = 'text',
    algorithmName: string = 'algorithm_id',
    fixationName: string = 'fix_uid',
    boxName: string = 'char_uid',
    dGeomName: string = 'D_geom',
    pShareName: string = 'P_share'
): ImportAnnotation => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const algorithmIndex = header.indexOf( algorithmName );
    const textIndex = header.indexOf( textName );
    const fixIndex = header.indexOf( fixationName );
    const boxIndex = header.indexOf( boxName );
    const dGeomIndex = header.indexOf( dGeomName );
    const pShareIndex = header.indexOf( pShareName );

    if ( fixIndex < 0 )
        throw new InvalidIndexNameError( 'X coordinate' );
    else if ( boxIndex < 0 )
        throw new InvalidIndexNameError( 'Y coordinate' );
    else if ( algorithmIndex < 0 )
        throw new InvalidIndexNameError( 'algorithm ID' );
    else if ( textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID' );

    const firstCols = lines[0]!.split( ',' );
    const firstEncounteredTextID = firstCols[ textIndex ];
    // First index is text, second id is reader
    const annotations: ImportAnnotation = {};

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        if ( firstEncounteredTextID !== cols[ textIndex ] && textFilter === undefined ) {
            throw new MultipleTextIDsWithoutSpecifiedTextIDError();
        }

        const addData = ( cols: string[] ) => {
            const algorithm = cols[ algorithmIndex ]!;

            if ( !annotations[ algorithm ] ) {
                annotations[ algorithm ] = {
                    'title': title,
                    'annotations': []
                };
            }

            const preAnnotation: PreAnnotationValueDto = {
                'foreignFixationId': parseInt( cols[ fixIndex ]! ),
                'foreignCharacterBoxId': parseInt( cols[ boxIndex ]! ),
                ...dGeomIndex >= 0 && cols[ dGeomIndex ] && {
                    'dGeom': parseFloat( cols[ dGeomIndex ] )
                },
                ...pShareIndex >= 0 && cols[ pShareIndex ] && {
                    'pShare': parseFloat( cols[ pShareIndex ] )
                }
            };

            annotations[ algorithm ]!.annotations!.push( preAnnotation );
        };

        if ( textFilter === undefined ) {
            addData( cols );
        } else if ( typeof textFilter === 'string' && cols[ textIndex ] === textFilter ) {
            addData( cols );
        } else if ( typeof textFilter === 'object' ) {
            const text = Number( cols[ textIndex ] );

            if ( textFilter.length === 2 ) {
                if ( text < textFilter[1] && text > textFilter[0] )
                    addData( cols );
            } else if ( textFilter.includes( text ) ) {
                addData( cols );
            }
        }
    }

    return annotations;
};
