import type {
    EditorCharacterBoundingBox
} from '../types/boxes';
import type {
    EditorFixation
} from '../types/fixations';
import {
    nearbyBoxesDistanceThreshold
} from '../../config';
import {
    selectedFixation
} from '../data';

const parseBBoxCSV = ( text: string ): EditorCharacterBoundingBox[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const x1Index = header.indexOf( 'x1' );
    const x2Index = header.indexOf( 'x2' );
    const y1Index = header.indexOf( 'y1' );
    const y2Index = header.indexOf( 'y2' );
    const charIndex = header.indexOf( 'character' );
    const boxes: EditorCharacterBoundingBox[] = lines.map( line => {
        const cols = line.split( ',' );

        return {
            'xMin': Number( cols[x1Index] ),
            'xMax': Number( cols[x2Index] ),
            'yMax': Number( cols[y1Index] ),
            'yMin': Number( cols[y2Index] ),
            'centerX': ( Number( cols[x1Index] ) + Number( cols[x2Index] ) ) / 2,
            'centerY': ( Number( cols[y1Index] ) + Number( cols[y2Index] ) ) / 2,
            'nearbyPoints': [],
            'character': String( cols[charIndex] ),
            'highlightClass': 'none'
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
const parsePointsCSVSingleSet = ( text: string ): EditorFixation[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( 'reader' );
    const textIndex = header.indexOf( 'text' );
    const xIndex = header.indexOf( 'x' );
    const yIndex = header.indexOf( 'y' );

    lines.shift();
    let index = 0;

    const points: EditorFixation[] = lines.map( line => {
        const cols = line.split( ',' );

        return {
            'reader': Number( cols[readerIndex] ),
            'x': Number( cols[xIndex] ),
            'y': Number( cols[yIndex] ),
            'id': index++,
            'text': Number( cols[ textIndex ] )
        };
    } )
        .filter( val => val.text === 1 && val.reader === 3 )
        .map( val => {
            return {
                'id': val.reader,
                'x': val.x * 100,
                'y': val.y * 100,
                'highlightClass': 'default',
                'assigned': 'unassigned'
            };
        } );

    selectedFixation.value = 0;

    return points;
};


export default {
    parseBBoxCSV,
    parsePointsCSVSingleSet
};
