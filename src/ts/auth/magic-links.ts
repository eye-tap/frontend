import type {
    UserData
} from '@/types/UserData';

export interface MagicLinkData {
    'user': string;
    'link': string;
}

const generate = ( username: string, password: string ): MagicLinkData => {
    const b64 = btoa( encodeURIComponent( JSON.stringify( {
        username,
        password
    } ) ) );

    return {
        'link': location.protocol + '//' + location.host + '/login?magic=' + b64,
        'user': username
    };
};

const getDecoded = (): UserData | null => {
    const baseStr = location.search.substring( location.search.indexOf( 'magic=' ) + 6 );
    const andIdx = baseStr.indexOf( '&' );
    const str = baseStr.slice( 0, andIdx > 0 ? andIdx : undefined );

    if ( str.length < 6 ) return null;

    return JSON.parse( decodeURIComponent( atob( str ) ) ) as UserData;
};

const checkIfAvailable = (): boolean => {
    return location.search.substring( location.search.indexOf( 'magic=' ) + 6 ).length > 5;
};


export default {
    generate,
    getDecoded,
    checkIfAvailable
};
