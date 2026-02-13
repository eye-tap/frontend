import type {
    FixationDto
} from '@/types/dtos/FixationDto';

export interface EditorFixation extends FixationDto {
    'entropy'?: number;
    'assigned': 'assigned' | 'unassigned' | 'machine';
}
