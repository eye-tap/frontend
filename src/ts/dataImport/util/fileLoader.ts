export const loadAllFilesOfElementAsStringWithCallback = async ( element: HTMLInputElement, cb: ( data: string ) => void ) => {
    const files = element.files;

    if ( files === null || files.length === 0 ) return Promise.reject( 'ERR_NO_FILE' );

    for ( let index = 0; index < files.length; index++ ) {
        cb( await fileLoaderString( files[ index ]! ) );
    }
};

export const fileLoader = ( file: File ): Promise<Response> => {
    return new Promise( ( resolve, reject ) => {
        fetch( URL.createObjectURL( file ) )
            .then( res => {
                if ( res.status === 200 ) {
                    resolve( res );
                } else {
                    console.error( 'Load failed with error code', res.status );
                    reject( 'ERR_LOAD_FAILED' );
                }
            } )
            .catch( e => {
                console.error( 'Load failed with error', e );
                reject( 'ERR_LOAD_FAILED' );
            } );
    } );
};

export const fileLoaderString = ( file: File ): Promise<string> => {
    return new Promise( ( resolve, reject ) => {
        fileLoader( file )
            .then( res => res.text()
                .then( resolve )
                .catch( reject ) )
            .catch( reject );
    } );
};
