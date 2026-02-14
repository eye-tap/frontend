import {
    boundingBoxes,
    fixations
} from '../data';
import {
    loadFileFromDiskAsString
} from '@/ts/dataImport/util/loadFileFromDisk';
import testingParser from '../util/testing-parser';

export const editorDataLoadingLocal = ( image: HTMLImageElement, redraw: () => void ) => {
    const loadImage = async ( e: InputEvent ) => {
        try {
            const file = ( e.target as HTMLInputElement )!.files![0];

            if ( !file ) return;

            const url = URL.createObjectURL( file );

            image.src = url;
        } catch ( e ) {
            Promise.reject( e );
        }
    };

    const loadPointsCSV = async ( e: InputEvent ) => {
        const data = await loadFileFromDiskAsString( e.target! as HTMLInputElement );

        fixations.value = testingParser.parsePointsCSVSingleSet( data );

        redraw();
    };

    const loadBBoxCSV = async () => {
        try {
            const res = await fetch( '/assets/text1_bb.csv' );
            const text = await res.text();

            boundingBoxes.value = testingParser.parseBBoxCSV( text );
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
