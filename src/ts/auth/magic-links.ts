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

const getDecoded = (): UserData => {
    const str = location.search.substring( location.search.indexOf( 'magic=' ) + 6 );

    console.log( str );

    return JSON.parse( decodeURIComponent( atob( str ) ) ) as UserData;
};


export default {
    generate,
    getDecoded
};
