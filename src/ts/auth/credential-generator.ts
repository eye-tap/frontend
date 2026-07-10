import type {
    UserData
} from '@/types/UserData';
import {
    backend
} from '../util/url';

export interface EyeTapStudyLoginGeneratorDetails {
    'studyId': number;
    'readingSessionIds': number[];
}

export const generateCredentials = async (): Promise<UserData> => {
    const studies: EyeTapStudyLoginGeneratorDetails[] = [];

    try {
        parseParams( location.search, studies );
    } catch ( error ) {
        return Promise.reject( error );
    }

    if ( studies.length < 1 ) {
        return Promise.reject( 'ERR_NO_STUDIES' );
    } else if ( studies.length === 1 ) {
        console.log( '[USER GEN] Creating account for survey ID', studies[0]!.studyId, 'with sids', studies[0]?.readingSessionIds );

        return await getCreds( studies[0]! );
    } else {
        const ridx = Math.round( Math.random() * ( studies.length - 1 ) );

        console.log( '[USER GEN] Assigned user to survey index', ridx, `(id = ${ studies[ridx]!.studyId }, sids = ${ studies[ridx]!.readingSessionIds })` );

        return await getCreds( studies[ridx]! );
    }
};

const getCreds = async ( study: EyeTapStudyLoginGeneratorDetails ): Promise<UserData> => {
    const res = await fetch( backend.url + '/generator/draw/' + study.studyId, {
        'method': 'POST',
        'body': JSON.stringify( study.readingSessionIds ),
        'headers': {
            'Content-Type': 'application/json'
        }
    } );
    const creds = await res.json();
    const username = Object.keys( creds )[0];

    if ( !username ) return Promise.reject( 'ERR_NO_CREDS' );

    return {
        'username': username,
        'password': creds[ username ]
    };
};

const parseParams = ( query: string, studies: EyeTapStudyLoginGeneratorDetails[], firstItem: boolean = true ) => {
    const idx = query.indexOf( 'study' );

    if ( idx > -1 ) {
        const sub = query.substring( idx );
        const studyDescStart = sub.indexOf( '=' );
        const endIdx = sub.indexOf( '&' );
        const split = sub.slice( studyDescStart + 1, endIdx > -1 ? endIdx : undefined ).split( '-' )
            .map( val => parseInt( val ) );
        const studyId = split.reverse().pop();

        if ( !studyId || split.length < 1 ) {
            if ( firstItem ) {
                throw new Error( 'ERR_NO_SESSIONS' );
            }
        } else {
            // Simply skip an item if after first item we fail to parse
            split.reverse();

            studies.push( {
                'readingSessionIds': split,
                'studyId': studyId
            } );
        }

        if ( endIdx > -1 )
            parseParams( sub.substring( endIdx + 1 ), studies, false );
    }
};
