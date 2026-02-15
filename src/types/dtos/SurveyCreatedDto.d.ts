import type { SurveyDto } from "@/types/dtos/SurveyDto.ts";

export interface SurveyCreatedDto {
  surveyDto?: SurveyDto;
  users?: Record<string, unknown>;
}
