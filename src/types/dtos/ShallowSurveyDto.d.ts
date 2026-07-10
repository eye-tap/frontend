import type {
    ProgressDto
} from '@/types/dtos/ProgressDto';

export interface ShallowSurveyDto {
    'id'?: number;
    'title'?: string;
    'description'?: string;
    'surveyProgressDto'?: ProgressDto;
}
