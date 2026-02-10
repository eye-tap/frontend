import type {
    ExportOptions
} from '@/types/files';
import {
    createZipArchive
} from '../files/zip';
import {
    useNotification
} from '@kyvg/vue3-notification';

const notifications = useNotification();

const startExport = async (
    include: ExportOptions
) => {
    let zip = new Blob( [] );

    try {
        zip = await createZipArchive( include );
    } catch ( e ) {
        console.error( e );
        notifications.notify( {
            'text': 'Export failed',
            'type': 'error',
            'title': 'Annotation Set Export'
        } );

        return;
    }

    notifications.notify( {
        'text': 'Export successful, downloading...',
        'type': 'success',
        'title': 'Annotation Set Export'
    } );

    setTimeout( () => {
        saveToDisk( zip );
    }, 1000 );
};

const saveToDisk = ( blob: Blob ) => {
    const a = document.createElement( 'a' );
    const url = URL.createObjectURL( blob );

    document.body.appendChild( a );
    a.style = 'display: none';
    a.href = url;
    a.download = 'export.zip';
    a.click();
    URL.revokeObjectURL( url );
};

export {
    startExport
};
