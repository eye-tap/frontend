import {
    bbKey,
    gazePointsKey,
    imageKey
} from '@/editor/config';
import {
    downloadFile, downloadFileAsBlob
} from '../files/file';
import type {
    ExportOptions
} from '@/ts/types/files';
import JSZip from 'jszip';
import {
    allPoints
} from '@/editor/scripts/internal-data';
import {
    convertAnnotationsToCSV
} from '../files/annotationSave';
import {
    useActiveFileStore
} from '@/ts/stores/activeFileStore';
import {
    useNotification
} from '@kyvg/vue3-notification';

const activeSet = useActiveFileStore();

const createZipArchive = async (
    include: ExportOptions
): Promise<Blob> => {
    const notifications = useNotification();
    const zip = new JSZip();

    let points = '';
    let image = new Blob( [] );
    let boundingBoxes = '';

    if ( include.image ) {
        let img: Blob | null = new Blob();

        try {
            img = await downloadFileAsBlob( activeSet.file.files[ imageKey ]!.id )!;
        } catch ( e ) {
            console.error( e );
        }

        if ( img && img !== null )
            image = img;
        else notifications.notify( {
            'text': 'Image is corrupt or unavailable and has been skipped',
            'type': 'warn',
            'title': 'Annotation Set Export'
        } );

        const details = activeSet.file.files[ imageKey ]!;

        let filetype = 'png';

        if ( details.filename )
            filetype = details.filename.substring( details.filename.lastIndexOf( '.' ) );
        else if ( details.originalFilename )
            filetype = details.originalFilename.substring( details.originalFilename.lastIndexOf( '.' ) );

        zip.file( 'image.' + filetype, image );
    }

    if ( include.boundingBoxes ) {
        try {
            boundingBoxes = await downloadFile( activeSet.file.files[ bbKey ]!.id );
        } catch ( e ) {
            console.error( e );
            notifications.notify( {
                'text': 'Bounding boxes are unavailable and have been skipped',
                'type': 'warn',
                'title': 'Annotation Set Export'
            } );
        }

        zip.file( 'bounding-boxes.csv', boundingBoxes );
    }

    if ( include.localAnnotations ) {
        points = convertAnnotationsToCSV( allPoints.value );
    } else if ( include.annotations ) {
        try {
            points = await downloadFile( activeSet.file.files[ gazePointsKey ]!.id );
        } catch ( e ) {
            console.error( e );
            notifications.notify( {
                'text': 'Annotations are unavailable and have been skipped',
                'type': 'warn',
                'title': 'Annotation Set Export'
            } );
        }

        zip.file( 'points.csv', points );
    }


    return await zip.generateAsync( {
        'type': 'blob'
    } );
};

export {
    createZipArchive
};
