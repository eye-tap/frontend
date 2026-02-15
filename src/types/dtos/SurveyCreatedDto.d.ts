import type {
    SurveyDto
} from '@/types/dtos/SurveyDto';

export interface SurveyCreatedDto {
    'surveyDto'?: SurveyDto;
    'users'?: Record<string, unknown>;
}
