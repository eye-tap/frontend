import type { CharacterBoundingBoxDto } from "@/types/dtos/CharacterBoundingBoxDto.ts";
import type { FixationDto } from "@/types/dtos/FixationDto.ts";

export interface AnnotationDto {
  id?: number;
  annotationType?: string;
  fixation?: FixationDto;
  characterBoundingBox?: CharacterBoundingBoxDto;
}
