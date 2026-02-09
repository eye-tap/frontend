const loadFileFromDisk = ( element: HTMLInputElement ): Promise<string> => {
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

        const reader = new FileReader();

        reader.onload = () => {
            resolve( String( reader.result ) );
        };

        reader.readAsText( file );
    } );
};

export {
    loadFileFromDisk
};
