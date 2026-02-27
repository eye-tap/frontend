import type {
    FixationDto
} from '@/types/dtos/FixationDto';
import type {
    TextDto
} from '@/types/dtos/TextDto';

export interface ReadingSessionDto {
    'fixations'?: FixationDto[];
    'textDto'?: TextDto;
}
