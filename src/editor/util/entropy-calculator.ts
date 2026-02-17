/**
 * Calculates entropy for a single fixation point
 * @param fixation - The {x, y} coordinates of the user's gaze
 * @param annotations - Array of annotation boxes {x, y, width, height}
 */
export const calculateFixationEntropy = ( fixation, annotations ) => {
    if ( annotations.length === 0 ) return 0;

    const scores = annotations.map( annotation => {
        const distance = Math.sqrt(
            Math.pow( fixation.x - annotation.centerX, 2 )
            + Math.pow( fixation.y - annotation.centerY, 2 )
        );

        return 1 / ( distance + 1 );
    } );
    const expScores = scores.map( s => Math.exp( s ) );
    const sumExpScores = expScores.reduce( ( a, b ) => a + b, 0 );
    const probabilities = expScores.map( s => s / sumExpScores );


    let entropy = 0;

    probabilities.forEach( p => {
        if ( p > 0 ) {
            entropy -= p * Math.log2( p );
        }
    } );

    return entropy;
};
