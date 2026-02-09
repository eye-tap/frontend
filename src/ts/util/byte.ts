const prefixes = [
    '',
    'K',
    'M',
    'G',
    'T',
    'P',
    'E',
    'Y',
    'Z'
];

export const humanReadableBytes = ( count: number ) => {
    let prefixPos = 0;

    while ( count / 1000 >= 1 ) {
        prefixPos++;
        count /= 1000;
    }

    return `${ Math.round( count * 100 ) / 100 }${ prefixes[ prefixPos ] }B`;
};
