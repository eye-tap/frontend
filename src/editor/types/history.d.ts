import type {
    EditorAnnotation
} from './annotation';

export interface HistoryEntry {
    'annotation': EditorAnnotation;
    'selectedFixation': number;
    'action': 'add' | 'delete';
    'fixationState': 'assigned' | 'unassigned' | 'machine' | 'invalid';
}

export interface AnnotationManager {
    'deleteByFixID': ( fixationId: number, addActionToHistory: boolean = false ) => void;
    'deleteByBoxID': ( boxId: number ) => void;
    'markAsInvalid': ( fixationId: number ) => void;
    'create': ( boundingBoxIndex: number, fixationIndex: number, skipHistory?: boolean, highlight?: boolean ) => void;
}
