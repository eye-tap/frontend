import type {
    BoundingBoxes
} from '@/definitions/editor';
import {
    nearbyBoxesDistanceThreshold
} from '../editor/data/config';

export const parseBBoxCSV = ( text: string ): BoundingBoxes[] => {
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
