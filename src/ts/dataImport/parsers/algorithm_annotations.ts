import {
    InvalidIndexNameError,
    MultipleTextIDsWithoutSpecifiedTextIDError
} from '../util/errors';
import type {
    ImportAnnotation
} from '@/types/import-annotation';

export const parseAlgorithmAnnotationsCSV = (
    text: string,
    title: string,
    textId?: string,
    textName: string = 'text',
    algorithm_id: string = 'algorithm_id',
    fixationName: string = 'fix_uid',
    boxName: string = 'char_uid',
    dGeomName: string = 'D_geom',
    pShareName: string = 'P_share'
): ImportAnnotation => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const algorithmName = header.indexOf( algorithm_id );
    const textIndex = header.indexOf( textName );
    const fixIndex = header.indexOf( fixationName );
    const boxIndex = header.indexOf( boxName );
    const dGeomIndex = header.indexOf( dGeomName );
    const pShareIndex = header.indexOf( pShareName );

    if ( fixIndex < 0 )
        throw new InvalidIndexNameError( 'X coordinate' );
    else if ( boxIndex < 0 )
        throw new InvalidIndexNameError( 'Y coordinate' );
    else if ( algorithmName < 0 )
        throw new InvalidIndexNameError( 'algorithm ID' );
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
            const algorithm = cols[ algorithmName ]!;

            if ( !annotations[ algorithm ] ) {
                annotations[ algorithm ] = {
                    'title': title,
                    'annotations': []
                };
            }

            const preAnnotation = {
                'foreignFixationId': parseInt( cols[ fixIndex ]! ),
                'foreignCharacterBoxId': parseInt( cols[ boxIndex ]! ),
                ...(dGeomIndex >= 0 && cols[ dGeomIndex ] && { 'dGeom': parseFloat( cols[ dGeomIndex ] ) }),
                ...(pShareIndex >= 0 && cols[ pShareIndex ] && { 'pShare': parseFloat( cols[ pShareIndex ] ) })
            };
            (annotations[ algorithm ]!.annotations as any).push( preAnnotation );
        } else if ( cols[ textIndex ] === textId ) {
            const algorithm = cols[ algorithmName ]!;

            if ( !annotations[ algorithm ] ) {
                annotations[ algorithm ] = {
                    'title': title,
                    'annotations': []
                };
            }

            const preAnnotation = {
                'foreignFixationId': parseInt( cols[ fixIndex ]! ),
                'foreignCharacterBoxId': parseInt( cols[ boxIndex ]! ),
                ...(dGeomIndex >= 0 && cols[ dGeomIndex ] && { 'dGeom': parseFloat( cols[ dGeomIndex ] ) }),
                ...(pShareIndex >= 0 && cols[ pShareIndex ] && { 'pShare': parseFloat( cols[ pShareIndex ] ) })
            };
            (annotations[ algorithm ]!.annotations as any).push( preAnnotation );
        }
    }

    return annotations;
};
