import type {
    AnnotationDoneEvent
} from '../eyetap-event';

declare global {
    interface GlobalEventHandlersEventMap {
        'eyetap:ethics:approve': CustomEvent<void>;
        'eyetap:ethics:show': CustomEvent<void>;
        'eyetap:login': CustomEvent<void>;
        'eyetap:end': CustomEvent<void>;
        'eyetap:timer-ended': CustomEvent<void>;
        'eyetap:file:load': CustomEvent<{
            'idx': number;
            'title': string;
        }>;
        'eyetap:file:unload': CustomEvent<void>;
        'eyetap:file:loading': CustomEvent<void>; // for showing loading spinner
        'eyetap:save': CustomEvent<void>;
        'eyetap:save:success': CustomEvent<void>;
        'eyetap:save:fail': CustomEvent<{
            'reason': string,
            'error'?: Error
        }>;
        'eyetap:undo': CustomEvent<void>;
        'eyetap:redo': CustomEvent<void>;
        'eyetap:annotation-done': CustomEvent<AnnotationDoneEvent>;
        'eyetap:keys:invalid': CustomEvent<number>;
        'eyetap:keys:char': CustomEvent<void>;
        'eyetap:keys:next': CustomEvent<void>;
        'eyetap:keys:prev': CustomEvent<void>;
        'eyetap:theme': CustomEvent<void>;
        'eyetap:survey:create': CustomEvent<void>;
    }
}
