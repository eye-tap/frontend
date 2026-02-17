import type {
    FixationDto
} from '@/types/dtos/FixationDto';

export interface EditorFixation extends FixationDto {
    'entropy'?: EditorEntropy;
    'assigned': 'assigned' | 'unassigned' | 'machine';
}

export interface EditorEntropy {
    [algo: string]: number;
}
