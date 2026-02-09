import type {
    AnnotationSession
} from './editor/annotationSession';
import type {
    User
} from './user';

export interface Survey {
    'users': User[];
    'id': number;
    'title': string;
    'description': string;
    'annotationSessions': AnnotationSession[];
    'admins': User[];
}
