import type {
    UserData
} from '@/types/UserData';

const generate = ( username: string, password: string ) => {
    const b64 = btoa( encodeURIComponent( JSON.stringify( {
        username,
        password
    } ) ) );

    return location.protocol + '//' + location.host + '/login?magic=' + b64;
};

const getDecoded = (): UserData | null => {
    const str = location.search.substring( location.search.indexOf( 'magic=' ) + 6 );

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
