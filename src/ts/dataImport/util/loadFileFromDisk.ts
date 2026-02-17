/**
 * Convenience wrapper around loadFileFromDisk.
 * @param element - An HTML Input Element with a selected file
 * @returns The contents of the file as string
 */
export const loadFileFromDiskAsString = ( element: HTMLInputElement ): Promise<string> => {
    return new Promise( ( resolve, reject ) => {
        loadFileFromDisk( element )
            .then( res => {
                res.text()
                    .then( resolve )
                    .catch( reject );
            } )
            .catch( reject );
    } );
};


/**
 * Flexibly get the contents of a file on disk
 * @param element - An HTML Input Element with a selected file
 * @returns A fetch response object that can then be used to get the
 * contents as blob, arraybuffer, UInt8Array, JSON or string.
 */
export const loadFileFromDisk = ( element: HTMLInputElement ): Promise<Response> => {
    return new Promise( ( resolve, reject ) => {
        if ( !element.files ) {
            reject( 'ERR_FILES_MISSING' );

            return;
        }

        const file = element.files[ 0 ];

        if ( !file ) {
            reject( 'ERR_NO_FILE' );

            return;
        }

        fileLoader( file )
            .then( resolve )
            .catch( reject );
    } );
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
