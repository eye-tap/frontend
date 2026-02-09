import type {
    BoundingBoxes,
    RawPoint
} from '../../types/editor';

/**
 * @param p - The point calculate the distance from
 * @param mouseX - The mouse's x-coordinate
 * @param mouseY - The mouse's y-coordinate
 * @returns The distance
 */
const pointDistance = ( p: RawPoint, mouseX: number, mouseY: number ): number => {
    const dx = Math.pow( p.x - mouseX, 2 );
    const dy = Math.pow( p.y - mouseY, 2 );

    return dx + dy;
};

/**
 * @param key - The key that was pressed
 * @returns True if it is a key of a character
 */
const isCharacterKey = ( key: string ) => {
    return key.length === 1 && key.match( /[a-zA-Z0-9]/ );
};

/**
 * @param event - keys that were pressed
 * @returns True if it's Ctrl + z
 */
const isUndoCmd = ( event: KeyboardEvent ) => {
    return ( event.ctrlKey || event.metaKey ) && event.key.toLowerCase() === 'z';
};

/**
 * @param event - keys that were pressed
 * @returns True if it's Ctrl + y or Ctrl + Shift + z
 */
const isRedoCmd = ( event: KeyboardEvent ) => {
    return ( ( event.ctrlKey || event.metaKey ) && event.key.toLowerCase() === 'y' )
        || ( ( event.ctrlKey || event.metaKey ) && event.shiftKey && event.key.toLowerCase() === 'z' );
};

/**
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param boxes - All boxes
 * @returns Returns null if no box was found, otherwise the index of the box in the boxes array
 */
const boxIndex = ( x: number, y: number, boxes: BoundingBoxes[] ): number | null => {
    for ( let i = 0; i < boxes.length; i++ ) {
        const bbox = boxes[i]!;

        if ( ( bbox.x1 <= x ) && ( bbox.x2 >= x ) && ( bbox.y1 >= y ) && ( bbox.y2 <= y ) ) {
            return i;
        }
    }

    return null;
};

export {
    pointDistance,
    isCharacterKey,
    isUndoCmd,
    isRedoCmd,
    boxIndex
};
