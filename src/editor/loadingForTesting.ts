import {
    allPoints,
    boxes,
    renderData as rd
} from './scripts/internal-data';
import {
    parseBBoxCSV, parsePointsCSVSingleSet
} from './scripts/util/parser';
import {
    convertAnnotationsToCSV
} from '@/ts/files/annotationSave';
import {
    loadGazePoints
} from '@/ts/files/import';

const useTestingEditorLoading = ( redraw: () => void ) => {
    const loadImage = async ( e: InputEvent ) => {
        try {
            const file = ( e.target as HTMLInputElement )!.files![0];

            if ( !file ) return;

            const url = URL.createObjectURL( file );

            rd.img = new Image();
            rd.img.src = url;

            rd.img.onload = () => {
                rd.ctx!.canvas.width = rd.img!.width;
                rd.ctx!.canvas.height = rd.img!.height;
                redraw();
            };
        } catch ( e ) {
            Promise.reject( e );
        }
    };

    const loadPointsCSV = async ( e: InputEvent ) => {
        const file = ( e.target as HTMLInputElement )!.files![0];

        if ( !file ) return;


        const reader = new FileReader();

        reader.onload = () => {
            const parsed = loadGazePoints( String( reader.result ), 1 ).points;
            const csv = convertAnnotationsToCSV( parsed );

            allPoints.value = parsePointsCSVSingleSet( csv );
        };

        reader.readAsText( file );
    };

    const loadBBoxCSV = async () => {
        try {
            const res = await fetch( '/assets/text1_bb.csv' );
            const text = await res.text();

            boxes.boxes = parseBBoxCSV( text );
            redraw();
        } catch ( err ) {
            console.error( 'Failed to load bounding boxes CSV:', err );
        }
    };

    return {
        loadImage,
        loadBBoxCSV,
        loadPointsCSV
    };
};

export {
    useTestingEditorLoading
};
