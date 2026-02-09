import type {
    User
} from '../user';
import type {
    Annotation
} from './fixations';

export interface AnnotationSession {
    'user': User;
    'lastEdit': number;
    'annotatedPoints': number;
    'totalPoints': number;
    'wordCount': number;
    'annotations': Annotation[];
}
