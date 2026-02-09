import type {
    EditorPoint,
    LoadedBoxes
} from '@/definitions/editor';

interface UploadedPoint extends EditorPoint {
    'text': number | undefined;
}

const parsePointsCSV = ( text: string ): UploadedPoint[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const readerIndex = header.indexOf( 'reader' );
    const textIndex = header.indexOf( 'text' );
    const xIndex = header.indexOf( 'x' );
    const yIndex = header.indexOf( 'y' );
    const annotatedIndex = header.indexOf( 'annotedbox' );
    const points: UploadedPoint[] = lines.map( line => {
        const cols = line.split( ',' );
        const tempx = Number( cols[xIndex] ) * 100;
        const tempy = Number( cols[yIndex] ) * 100;

        let annotatedValue = null;

        if ( annotatedIndex !== -1 ) {
            const raw = cols[annotatedIndex]?.trim();

            if ( raw !== '' && raw !== undefined ) {
                annotatedValue = isNaN( Number( raw ) ) ? raw : Number( raw );
            }
        }

        return {
            'reader': Number( cols[ readerIndex ] ),
            'text': textIndex < 0 ? undefined : Number( cols[ textIndex ] ),
            'x': tempx,
            'y': tempy,
            'annotedbox': annotatedValue
        };
    } );

    return points;
};

const loadGazePoints = ( text: string, id: number ): {
    'points': EditorPoint[];
    'gazePointCount': number
} => {
    let data = parsePointsCSV( text );

    if ( data[ 0 ] && data[ 0 ].text ) {
        data = data.filter( point => {
            return point.text === id;
        } );
    }

    const res = data.map<EditorPoint>( val => {
        return {
            'x': val.x,
            'y': val.y,
            'reader': val.reader,
            'annotedbox': val.annotedbox
        };
    } );

    return {
        'points': res,
        'gazePointCount': data.length
    };
};

const countWords = ( bbs: LoadedBoxes[] ): number => {
    let counter = 0;

    for ( const bb of bbs ) {
        if ( bb.character === ' ' ) {
            counter++;
        }
    }

    const hasContent = bbs.some( bb => bb.character !== ' ' );

    return hasContent ? counter + 1 : 0;
};


interface UploadBoundingBoxes extends LoadedBoxes {
    'text': number;
}

const parseBBoxCSVFull = ( text: string ): UploadBoundingBoxes[] => {
    const lines = text.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    const x1Index = header.indexOf( 'bbox_x1' );
    const x2Index = header.indexOf( 'bbox_x2' );
    const y1Index = header.indexOf( 'bbox_y1' );
    const y2Index = header.indexOf( 'bbox_y2' );
    const charIndex = header.indexOf( 'character' );
    const textIndex = header.indexOf( 'text_id' );
    const boxes: UploadBoundingBoxes[] = lines.map( line => {
        const cols = line.split( ',' );

        return {
            'x1': Number( cols[x1Index] ),
            'x2': Number( cols[x2Index] ),
            'y1': Number( cols[y1Index] ),
            'y2': Number( cols[y2Index] ),
            'character': String( cols[charIndex] ),
            'text': Number( cols[ textIndex ] )
        };
    } );

    return boxes;
};

const loadBoundingBoxes = ( text: string, id: number ): {
    'boxes': LoadedBoxes[];
    'wordCount': number
} => {
    let data = parseBBoxCSVFull( text );

    if ( data[ 0 ] && data[ 0 ].text ) {
        data = data.filter( box => {
            return box.text === id;
        } );
    }

    const res = data.map<LoadedBoxes>( val => {
        return {
            'x1': val.x1,
            'x2': val.x2,
            'y1': val.y1,
            'y2': val.y2,
            'character': val.character
        };
    } );

    return {
        'boxes': res,
        'wordCount': countWords( res )
    };
};


export {
    loadGazePoints,
    loadBoundingBoxes
};
