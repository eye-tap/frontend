const shuffle = <T>( array: T[] ): T[] => {
    let i = array.length;

    const arr = [ ...array ];

    while ( i != 0 ) {
        const j = Math.floor( Math.random() * i );

        i--;
        [
            arr[i],
            arr[j]
        ] = [
            arr[j]!,
            arr[i]!
        ];
    }

    return arr;
};

export {
    shuffle
};
