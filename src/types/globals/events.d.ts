import type {
    AnnotationDoneEvent
} from '../eyetap-event';

declare global {
    interface GlobalEventHandlersEventMap {
        'eyetap:fileload': CustomEvent<{
            'idx': number;
            'title': string;
        }>;
        'eyetap:fileunload': CustomEvent<void>;
        'eyetap:save': CustomEvent<void>;
        'eyetap:undo': CustomEvent<void>;
        'eyetap:redo': CustomEvent<void>;
        'eyetap:annotation-done': CustomEvent<AnnotationDoneEvent>;
        'eyetap:keys:char': CustomEvent<void>;
        'eyetap:keys:next': CustomEvent<void>;
        'eyetap:keys:prev': CustomEvent<void>;
    }
}
