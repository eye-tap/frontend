import type { ShallowAnnotationSessionDto } from "@/types/dtos/ShallowAnnotationSessionDto";

export interface SurveyDto {
  id?: number;
  userIds?: number[];
  title?: string;
  description?: string;
  annotationSessions?: ShallowAnnotationSessionDto[];
}
