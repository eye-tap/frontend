import type {
    PreAnnotationValueDto
} from './dtos/PreAnnotationValueDto';


export interface ImportConfig<T> {
    'name': string;
    'desc'?: string;
    'options': ParserOptsList<unknown>,
    'parse': ( inputElement: HTMLInputElement, textId: string ) => Promise<T>
    'canParse'?: ( header: string[] ) => boolean;
}

export interface ParserOptsList<T> {
    [key: string]: ParserOption<T>
}

export interface ParserOption<T> {
    /**
     * A user-facing description of the option
     */
    'display': string;

    /**
     * The input type you'd like
     */
    'input': 'number' | 'string' | 'dropdown' | 'boolean' | 'file';

    /**
     * Set the options to display in a dropdown (if set to select)
     */
    'options'?: string[];

    /**
     * Set to default on initialization
     */
    'value': T;
}

export interface ImportAnnotation {
    [algo: string]: ImportAnnotationPreProcessing[];
}

export interface ImportAnnotationPreProcessing extends PreAnnotationValueDto {
    'textid': string;
}
