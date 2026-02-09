import type {
    BoundingBoxes,
    EditorPoint
} from '../../types/editor';
import {
    boxes, pointSelected, selectedPoint
} from '../internal-data';
import {
    boxIndex
} from './util';
import {
    nearbyBoxesDistanceThreshold
} from '../../config';

const parseBBoxCSV = ( text: string ): BoundingBoxes[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const x1Index = header.indexOf( 'x1' );
    const x2Index = header.indexOf( 'x2' );
    const y1Index = header.indexOf( 'y1' );
    const y2Index = header.indexOf( 'y2' );
    const charIndex = header.indexOf( 'character' );
    const boxes: BoundingBoxes[] = lines.map( line => {
        const cols = line.split( ',' );

        return {
            'x1': Number( cols[x1Index] ),
            'x2': Number( cols[x2Index] ),
            'y1': Number( cols[y1Index] ),
            'y2': Number( cols[y2Index] ),
            'centerX': ( Number( cols[x1Index] ) + Number( cols[x2Index] ) ) / 2,
            'centerY': ( Number( cols[y1Index] ) + Number( cols[y2Index] ) ) / 2,
            'nearbyPoints': [],
            'character': String( cols[charIndex] )
        };
    } );

    for ( let i = 0; i < boxes.length; i++ ) {
        for ( let j = i + 1; j < boxes.length; j++ ) {
            const boxA = boxes[i]!;
            const boxB = boxes[j]!;
            const distance = Math.sqrt( Math.pow( boxA.centerX - boxB.centerX, 2 ) + Math.pow( boxA.centerY - boxB.centerY, 2 ) );

            if ( distance < nearbyBoxesDistanceThreshold.value ) {
                boxA.nearbyPoints.push( j );
                boxB.nearbyPoints.push( i );
            }
        }
    }

    return boxes;
};

/**
 * Parse the backend-provided CSV into usable data. The data has to be of an exact format
 * @param text - The CSV file
 * @returns Parsed points
 */
const parsePointsCSVSingleSet = ( text: string ): EditorPoint[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const readerIndex = 0;
    const xIndex = 1;
    const yIndex = 2;
    const annotatedIndex = 3;

    lines.shift();
    const points: EditorPoint[] = lines.map( line => {
        const cols = line.split( ',' );
        const tempx = Number( cols[xIndex] );
        const tempy = Number( cols[yIndex] );
        const rawAnnotation = cols[annotatedIndex]?.trim();

        let annotatedValue = null;

        if ( rawAnnotation !== '' && rawAnnotation !== undefined ) {
            annotatedValue = isNaN( Number( rawAnnotation ) ) ? rawAnnotation : Number( rawAnnotation );
        }

        return {
            'reader': Number( cols[readerIndex] ),
            'x': tempx,
            'y': tempy,
            'annotedbox': annotatedValue !== null ? annotatedValue : boxIndex( tempx, tempy, boxes.boxes )
        };
    } );
    const firstPointSelected = points.find( p => p.annotedbox === null );

    if ( firstPointSelected ) {
        selectedPoint.value = firstPointSelected;
        pointSelected.isTrue = true;
    }

    return points;
};


export {
    parseBBoxCSV,
    parsePointsCSVSingleSet
};
