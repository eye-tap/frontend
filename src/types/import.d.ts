import type {
    PreAnnotationValueDto
} from './dtos/PreAnnotationValueDto';


export interface ImportConfig<T> {
    'display': string;
    'desc'?: string;
    'options': ParserOptsList<unknown>,
    'parse': ( inputElement: HTMLInputElement, textId: string, lang: string ) => Promise<T>
    'canParse'?: ( header: string[], fileCount: number ) => boolean;
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

    /**
     * Terms that can be searched for in the header to autoamtically generate assignment
     */
    'searchTerms'?: string[];

    /**
     * Whether it is required to have a valid assignment for the parser to be usable.
     * Thus: If true, assignment not required
     */
    'optional'?: boolean;

    /**
     * Notes to display on the parser details page
     */
    'notes'?: string;
}

export interface ImportAnnotation {
    [algo: string]: ImportAnnotationPreProcessing[];
}

export interface ImportAnnotationPreProcessing extends PreAnnotationValueDto {
    'textid': string;
}
