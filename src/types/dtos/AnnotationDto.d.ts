import type { CharacterBoundingBoxDto } from "@/types/dtos/CharacterBoundingBoxDto";
import type { FixationDto } from "@/types/dtos/FixationDto";

export interface AnnotationDto {
  id?: number;
  annotationType?: string;
  fixation?: FixationDto;
  characterBoundingBox?: CharacterBoundingBoxDto;
}
