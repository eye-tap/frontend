export const loadVideo = ( attachElement: HTMLElement, videoId: string, width: number = 420, height: number = 315 ) => {
    if ( !attachElement ) return;

    const iframe = document.createElement( 'iframe' );

    iframe.height = '' + height;
    iframe.width = '' + width;

    iframe.src = 'https://youtube.com/embed/' + videoId;

    attachElement.appendChild( iframe );
};

export const getVideoIdFromYTLink = ( link: string ) => {
    if ( link.startsWith( 'https://www.youtube.com/watch?v=' ) ) {
        const id = link.substring( link.indexOf( '?v=' ) + 3 );
        const q = id.indexOf( '&' );

        if ( q > 0 ) {
            return id.slice( 0, q );
        }

        return id;
    } else if ( link.startsWith( 'https://youtu.be/' ) ) {
        const q = link.indexOf( '?' );

        if ( q > 0 ) {
            return link.slice( link.lastIndexOf( '/' ) + 1, q );
        }

        return link.substring( link.lastIndexOf( '/' ) + 1 );
    } else {
        return 'INVALID';
    }
};
