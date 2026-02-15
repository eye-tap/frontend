import type {
    FixationDto
} from '@/types/dtos/FixationDto.ts';
import type {
    TextDto
} from '@/types/dtos/TextDto.ts';

export interface ReadingSessionDto {
    'fixations'?: FixationDto[];
    'textDto'?: TextDto;
}
