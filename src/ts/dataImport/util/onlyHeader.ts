export const getOnlyHeader = ( text: string ) => {
    let header = '';

    for ( let i = 0; i < text.length; i++ ) {
        const char = text[i];

        if ( char === '\n' || char === '\r' )
            return header;
        else header += char;
    }

    return header;
};
