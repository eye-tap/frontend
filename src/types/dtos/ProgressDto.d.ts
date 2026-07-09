import type {
    OverallProgressStatisticsDto
} from '@/types/dtos/OverallProgressStatisticsDto';

export interface ProgressDto {
    'statisticsDto'?: OverallProgressStatisticsDto;
    'progress'?: Record<string, unknown>;
}
