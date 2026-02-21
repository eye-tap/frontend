import type {
    FixationDto
} from '@/types/dtos/FixationDto';

export interface EditorFixation extends FixationDto {
    'assigned': 'assigned' | 'unassigned' | 'machine';
}
