import type {
    BoundingBox
} from '@/editor/types/boxes';
import type {
    Fixation
} from '@/editor/types/fixations';

export interface ExportOptions {
    'image': boolean,
    'boundingBoxes': boolean,
    'annotations': boolean,
    'localAnnotations': boolean
}

export interface NewFileUpload {
    /**
     * Image, Base64 encoded
     */
    'image': string;
    'boundingBoxes': BoundingBox[];
    'fixations': Fixation[];
}
