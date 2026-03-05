import type {
    EditorPoint
} from '../types/annotation';

export const distanceBetweenPoints = ( p1: EditorPoint, p2: EditorPoint ) => {
    return Math.sqrt( Math.pow( p1.x - p2.x, 2 ) + Math.pow( p1.y - p2.y, 2 ) );
};


/**
 * Computes the modulo of a number because JS is too stupid to do it properly
 * @param val - The value to compute for
 */
export const mod = ( val: number, mod: number ) => {
    return ( ( val % mod ) + mod ) % mod;
};
