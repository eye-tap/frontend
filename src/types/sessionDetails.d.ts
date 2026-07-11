import type {
    OverallProgressStatisticsDto
} from './dtos/OverallProgressStatisticsDto';
import type {
    SessionProgress
} from '@/ts/stats/loader';

export interface AnnotationSessionDetails {
    'textId': number;
    'title': string;
    'reader': number;
    'sessionId': number;
    'desc': string;
    'completed'?: boolean;
}

export interface SurveyDetails {
    'id'?: number,
    'title'?: string,
    'description'?: string,
    'surveyProgress'?: {
        'sessions'?: SessionProgress[],
        'statistics'?: OverallProgressStatisticsDto
    }
}
