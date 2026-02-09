import type {
    AnnotationSession
} from './editor/annotationSession';
import type {
    User
} from './user';

// TODO: Not sure I got everything covered
export interface Survey {
    'users': User[];
    'id': number;
    'title': string;
    'description': string;
    'annotationSessions': AnnotationSession[];
    'admins': User[];
}
