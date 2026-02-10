import type {
    Annotation
} from './fixations';
import type {
    User
} from '../user';

export interface AnnotationSession {
    'user': User;
    'lastEdit': number;
    'annotatedPoints': number;
    'totalPoints': number;
    'wordCount': number;
    'annotations': Annotation[];
}
