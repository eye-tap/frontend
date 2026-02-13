import type {
    FixationDto
} from '@/types/dtos/FixationDto';

export interface EditorFixation extends FixationDto {
    'highlightClass': 'selected' | 'assigned' | 'unassigned' | 'machine' | 'entropy';
    'entropy'?: number;
}
