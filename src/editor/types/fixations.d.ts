export interface Fixation {
    'id': number;
    'x': number;
    'y': number;
}

export enum AnnotationType {
    'UNANNOTATED',
    'MACHINE_ANNOTATED',
    'ANNOTATED'
}

export interface Annotation {
    'annotationType': AnnotationType,
    'id': number;
    'fixation': Fixation;
}
