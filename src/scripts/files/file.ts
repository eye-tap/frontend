import type {
    AnnotationProgress, AnnotationSet, UploadedFile
} from '@/definitions/files';
import request from '@/scripts/request';

/**
 * List all annotation sets for the authenticated user
 */
export async function listAnnotationSets (): Promise<AnnotationSet[]> {
    try {
        const res = await request.get( '/annotation/session' );
        console.log(await JSON.parse(res));
        return JSON.parse( res ) as AnnotationSet[];
    } catch ( err ) {
        console.error( 'Failed to fetch annotation sets', err );

        throw new Error( 'ERR_LOAD_ANNOTATION_SET' );
    }
}

/**
 * Create a new annotation set
 */
export async function createAnnotationSet (
    baseName: string,
    wordCount: number,
    gazePoints: number
):
Promise<AnnotationSet | null> {
    try {
        const res = await request.post( '/annotation-sets/', {
            'baseName': baseName
        } );

        if ( !res.ok
        ) {
            console.error( `Failed to create annotation set: ${ res.status }` );

            return null;
        }

        const text = await res.text();
        const result = JSON.parse( text ) as AnnotationSet;

        result.progress = JSON.parse( await ( await request.post( '/annotation-sets/progress', {
            'annotationSetId': result.id,
            'uploaded': Date.now(),
            'wordCount': wordCount,
            'gazePoints': gazePoints,
            'assigned': 0
        } ) ).text() ) as AnnotationProgress;

        return result;
    } catch
    ( err ) {
        console.error( 'Create annotation set error:', err );

        return null;
    }
}

/**
 * Upload a file for the authenticated user
 */
export async function uploadFile (
    file: File,
    annotationSetId: number,
    role: string
): Promise<UploadedFile | null> {
    try {
        const formData = new FormData();

        formData.append( 'file', file );
        formData.append( 'annotationSetId', String( annotationSetId ) );
        formData.append( 'role', role );

        const res = await request.postFormData( '/files/upload', formData );

        if ( !res.ok ) {
            console.error( `Failed to upload file: ${ res.status }` );

            return null;
        }

        const text = await res.text();

        return JSON.parse( text ) as UploadedFile;
    } catch ( err ) {
        console.error( 'Upload file error:', err );

        return null;
    }
}

/**
 * Download a file by ID (returns text)
 * @param id The text ID obtained from the fileList
 */
export async function downloadFile ( id: number ): Promise<string> {
    return request.get( `/files/${ id }` );
}

/**
 * Download a file by ID (returns a Blob)
 */
export async function downloadFileAsBlob ( id: number ): Promise<Blob | null> {
    try {
        const res = await request.getRequest( `/files/${ id }` );

        if ( !res.ok ) {
            console.error( `Failed to download file: ${ res.status }` );

            return null;
        }

        return await res.blob();
    } catch ( err ) {
        console.error( 'Download file error:', err );

        return null;
    }
}

/**
 * Save or update annotation progress for a given annotation set.
 */
export async function saveAnnotationProgress ( progress: {
    'annotationSetId': number;
    'uploaded': number;
    'wordCount': number;
    'gazePoints': number;
    'assigned': number;
} ): Promise<AnnotationProgress | null> {
    try {
        const d = {
            ...progress,
            'modified': new Date().getTime()
        };
        const res = await request.post( '/annotation-sets/progress', d );

        if ( !res.ok ) {
            console.error( `Failed to save annotation progress: ${ res.status }` );

            return null;
        }

        const data = await res.json();

        return data as AnnotationProgress;
    } catch ( err ) {
        console.error( 'Error saving annotation progress:', err );

        return null;
    }
}
