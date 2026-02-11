import router from '@/ts/router';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useStatusStore
} from '@/ts/stores/status';

/**
 * GET data from backend, authentication and rejected authentication
 * are handled automatically. Results in string
 * @param url - only the path (like /auth)
 * @returns A promise resolving to the response parsed as string
 */
const get = ( url: string, noRedirect = false ): Promise<string> => {
    return new Promise( ( resolve, reject ) => {
        requestWithOpts( url, {}, noRedirect )
            .then( res => res.text()
                .then( resolve )
                .catch( reject ) )
            .catch( reject );
    } );
};

/**
 * GET data from backend, authentication and rejected authentication
 * are handled automatically.
 * @param url - only the path (like /auth)
 * @returns A promise resolving to the raw response object if accepting status
 */
const getRequest = ( url: string, noRedirect = false ): Promise<Response> => {
    return requestWithOpts( url, {}, noRedirect );
};

/**
 * Send data to backend, authentication and rejected authentication
 * are handled automatically
 * @param url - only the path (like /auth)
 * @param data - The data to send
 * @returns A promise resolving to the response object
 */
const post = ( url: string, data: object, noRedirect = false ): Promise<Response> => {
    const fetchOptions: RequestInit = {
        'method': 'post',
        'body': JSON.stringify( data ),
        'credentials': 'include',
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    return requestWithOpts( url, fetchOptions, noRedirect );
};

/**
 * Send data to backend, authentication and rejected authentication
 * are handled automatically, but formdata is the data type
 * @param url - only the path (like /auth)
 * @param data - The data to send
 * @returns A promise resolving to the response parsed as text
 */
const postFormData = ( url: string, data: FormData, noRedirect = false ): Promise<Response> => {
    const fetchOptions: RequestInit = {
        'method': 'post',
        'body': data
    };

    return requestWithOpts( url, fetchOptions, noRedirect );
};

/**
 * Usually should not be used directly, use a wrapper from this file.
 * Automatically handles authentication and rejection thereof
 * @param url - only the path (like /auth)
 * @param data - The data to send
 * @returns A promise resolving to the response parsed as text
 */
const requestWithOpts = ( url: string, opts: RequestInit, noRedirect = false ): Promise<Response> => {
    const token = localStorage.getItem( 'jwt' );
    const status = useStatusStore();
    const notifications = useNotification();

    if ( !token ) {
        if ( !status.devMode )
            status.isAuth = false;

        if ( !status.devMode && !noRedirect ) {
            notifications.notify( {
                'text': 'Unauthorized. Please log in',
                'type': 'error',
                'title': 'Authentication'
            } );

            router.push( '/login' );
        }

        return Promise.reject( 'NO_AUTH' );
    }

    const baseUrl = localStorage.getItem( 'url' );

    if ( !baseUrl ) {
        return Promise.reject( 'NO_URL' );
    }


    return new Promise( ( resolve, reject ) => {
        fetch( baseUrl + url, {
            ...opts,
            'headers': {
                ...opts.headers || {},
                'Authorization': `Bearer ${ token }`
            }
        } )
            .then( res => {
                if ( res.status >= 200 && res.status < 300 ) {
                    resolve( res );
                } else if ( res.status === 429 ) {
                    reject( 'RATE_LIMIT' );
                } else if ( res.status === 401 || res.status === 403 ) {
                    if ( !status.devMode ) {
                        status.isAuth = false;
                        localStorage.removeItem( 'jwt' );
                    }

                    if ( !status.devMode && !noRedirect ) {
                        notifications.notify( {
                            'text': 'Unauthorized. Please log in',
                            'type': 'error',
                            'title': 'Authentication'
                        } );

                        router.push( '/login' ).then( () => reject( 'NO_AUTH' ) );
                    } else {
                        reject( 'NO_AUTH' );
                    }
                } else if ( res.status === 500 ) {
                    res.text()
                        .then( text => {
                            reject( text );
                        } )
                        .catch( e => {
                            reject( e );
                        } );
                } else {
                    reject( res.status );
                }
            } )
            .catch( e => reject( e ) );
    } );
};


export default {
    get,
    getRequest,
    post,
    postFormData
};
