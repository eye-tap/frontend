export const OPTION_STRUCTURE = {
    'display': [
        'boxesDisplay',
        'linesDisplay',
        'fixationDisplay',
        'fixationIndexDisplay',
        'highlightSuggestedBox'
    ],
    'scanPathLength': [ 'scanPathLength' ],
    'colours': [
        'assignedLineColor',
        'mappedUnfocusedTextColor',
        'mappedHoveredTextColor',
        'boundingBoxColor',
        'unassignedFixationColor',
        'scanPathLineColor'
    ],
    'sizes': [
        'assignedLineSize',
        'scanPathLineSize',
        'boxStroke',
        'pointRadius'
    ]
} as const satisfies Record<string, readonly string[]>;

export type SectionKey = keyof typeof OPTION_STRUCTURE;

export type OptionKey = typeof OPTION_STRUCTURE[ SectionKey ][ number ];


export const makeVisibility = ( allowed: readonly ( OptionKey | SectionKey )[] | undefined ) => {
    const isOptionVisible = ( key: OptionKey | SectionKey ): boolean => {
        if ( !allowed ) return true;

        if ( allowed.includes( key ) ) return true;

        const parent = ( Object.keys( OPTION_STRUCTURE ) as SectionKey[] )
            .find( s => ( OPTION_STRUCTURE[ s ] as readonly string[] ).includes( key ) );

        return parent ? allowed.includes( parent ) : false;
    };

    const isSectionVisible = ( section: SectionKey ): boolean => OPTION_STRUCTURE[ section ].some( opt => isOptionVisible( opt ) );

    return {
        isOptionVisible,
        isSectionVisible
    };
};
