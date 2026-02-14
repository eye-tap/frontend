import type {
    EditorAnnotation
} from './annotation';

export interface HistoryEntry {
    'annotation': EditorAnnotation;
    'selectedFixation': number;
}

export interface AnnotationManager {
    'deleteByFixID': ( fixationId: number ) => void;
    'deleteByBoxID': ( boxId: number ) => void;
    'create': ( boundingBoxIndex: number, fixationIndex: number, skipHistory?: boolean ) => void;
}
