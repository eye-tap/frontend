import type {
    ImportConfig
} from '@/types/import';


/**
 * Automatically determine correct parser settings from the header and options list in parser
 * @param header - Array of header elements
 * @param parser - The parser to check for
 * @returns True if options were determined successfully, false otherwise
 */
export const determineCorrectParserSettings = (
    header: string[],
    parser: ImportConfig<unknown[]>
): boolean => {
    const opts = Object.keys( parser.options );

    for ( let i = 0; i < opts.length; i++ ) {
        const opt = parser.options[ opts[i]! ]!;

        if ( opt.searchTerms && opt.searchTerms.length > 0 ) {
            const idx = runIteration( header, opt.searchTerms );

            if ( idx < 0 ) {
                if ( !opt.optional ) return false;
            } else {
                opt.value = header[ idx ]!;
            }
        }
    }

    return true;
};

const runIteration = ( header: string[], terms: string[] ) => {
    for ( let j = 0; j < header.length; j++ ) {
        for ( let k = 0; k < terms.length; k++ ) {
            if ( header[j]!.includes( terms[ k ]! ) )
                return j;
        }
    }

    return -1;
};
