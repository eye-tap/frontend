export interface UploadedFile {
    'id': number;
    'filename': string;
    'originalFilename': string;
}

export interface AnnotationProgress {
    'id': number;
    'uploaded': number;
    'wordCount': number;
    'gazePoints': number;
    'assigned': number;
    'modified': number;
}

export interface AnnotationSet {
    'id': number;
    'baseName': string;
    'files': Partial<Record<string, UploadedFile>>; // key = FileRole, e.g. 'text_image', 'gaze_points'
    'progress'?: AnnotationProgress;
}

export interface ExportOptions {
    'image': boolean,
    'boundingBoxes': boolean,
    'annotations': boolean,
    'localAnnotations': boolean
}
