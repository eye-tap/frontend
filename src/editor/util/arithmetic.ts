import type {
    EditorPoint
} from '../types/annotation';

export const distanceBetweenPoints = ( p1: EditorPoint, p2: EditorPoint ) => {
    return Math.sqrt( Math.pow( p1.x - p2.x, 2 ) + ( p2.x - p2.y ) );
};
