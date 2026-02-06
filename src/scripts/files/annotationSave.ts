import type {
    EditorPoint,
    LoadedBoxes
} from '@/definitions/editor';

export const convertAnnotationsToCSV = ( points: EditorPoint[] ) => {
    let csv = 'reader, x, y, annotatedbox\n';

    for ( let i = 0; i < points.length; i++ ) {
        const point = points[ i ]!;

        csv += `${ point.reader }, ${ point.x }, ${ point.y }, ${ point.annotedbox !== null ? point.annotedbox : '' }\n`;
    }

    return csv;
};


export const convertBoundingBoxesToCSV = ( boxes: LoadedBoxes[] ) => {
    let csv = 'character, x1, x2, y1, y2\n';

    for ( let i = 0; i < boxes.length; i++ ) {
        const box = boxes[ i ]!;

        csv += `${ box.character }, ${ box.x1 }, ${ box.x2 }, ${ box.y1 }, ${ box.y2 }\n`;
    }

    return csv;
};
