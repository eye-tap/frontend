import type { SurveyDto } from "@/editor/types/dtos/SurveyDto.ts";

export interface SurveyCreatedDto {
  surveyDto?: SurveyDto;
  users?: Record<string, unknown>;
}
