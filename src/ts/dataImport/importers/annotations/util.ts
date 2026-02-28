import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';
import {
    InvalidIndexNameError
} from '../../util/errors';
import type {
    ParserOptsList
} from '@/types/import';

export const annotationOpts: ParserOptsList<unknown> = {
    'fixid': {
        'display': 'Fixation ID',
        'value': 'fix_uid',
        'input': 'string',
        'searchTerms': [ 'fix' ]
    },
    'id': {
        'display': 'Annotation ID',
        'value': 'annot_id',
        'input': 'string',
        'searchTerms': [ 'annot' ]
    },
    'charid': {
        'display': 'Character ID',
        'value': 'char_uid',
        'input': 'string',
        'searchTerms': [ 'char' ]
    },
    'dgeom': {
        'display': 'Geometric Mean',
        'value': 'D_geom_mean',
        'input': 'string',
        'searchTerms': [
            'D_geom',
            'd_geom',
            'dgeom'
        ]
    },
    'pshare': {
        'display': 'P share', // TODO: Update these names
        'value': 'P_share_mean',
        'input': 'string',
        'searchTerms': [
            'P_share',
            'p_share',
            'pshare'
        ]
    },
    'algo': {
        'display': 'Algorithm',
        'value': 'algorithm_id',
        'input': 'string',
        'searchTerms': [ 'algo' ]
    }
};


export const mainParser = (
    data: string,
    opts: ParserOptsList<unknown>,
    textId: string,
    lang: string,
    reassociationMap?: Map<string, string>
): ImportPreAnnotationDto[] => {
    const lines = data.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const fixIndex = header.indexOf( opts.fixid!.value as string );
    const textIndex = opts.textID
        ? header.indexOf( opts.textID!.value as string )
        : ( opts.textUID ? header.indexOf( opts.textUID!.value as string ) : -1 );
    const charIndex = header.indexOf( opts.charid!.value as string );
    // const idIndex = header.indexOf( opts.id!.value as string );
    const dgeomIndex = header.indexOf( opts.dgeom!.value as string );
    const pshareIndex = header.indexOf( opts.pshare!.value as string );
    const algoIndex = header.indexOf( opts.algo!.value as string );
    const langIndex = opts.lang ? header.indexOf( opts.lang.value as string ) : -1;
    const parsed: {
        [algo: string]: ImportPreAnnotationDto
    } = {};

    if ( textIndex < 0 )
        throw new InvalidIndexNameError( 'text ID (for Annotations)' );
    else if ( algoIndex < 0 )
        throw new InvalidIndexNameError( 'algorithm name (for Annotations)' );

    for ( let i = 0; i < lines.length; i++ ) {
        const cols = lines[i]!.split( ',' );

        let actualTextID = cols[ textIndex ]!;

        if ( reassociationMap ) {
            actualTextID = reassociationMap.get( cols[ textIndex ]! ) ?? '';
        }

        if ( actualTextID === textId && ( lang === 'undefined' || ( langIndex > -1 ? cols[langIndex]! === lang : true ) ) ) {
            if ( !parsed[ cols[ algoIndex ]! ] )
                parsed[ cols[ algoIndex ]! ] = {
                    'title': cols[ algoIndex ]!,
                    'annotations': []
                };

            parsed[ cols[ algoIndex ]! ]!.annotations!.push( {
                'foreignFixationId': Number( cols[ fixIndex ]! ),
                'foreignCharacterBoxId': Number( cols[ charIndex ]! ),
                'dGeom': dgeomIndex >= 0 ? Number( cols[dgeomIndex]! ) : undefined,
                'pShare': pshareIndex >= 0 ? Number( cols[pshareIndex]! ) : undefined
            } );
        }
    }

    return Object.values( parsed );
};
