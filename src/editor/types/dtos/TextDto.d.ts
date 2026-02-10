import type { CharacterBoundingBoxDto } from "@/editor/types/dtos/CharacterBoundingBoxDto.ts";
import type { WordBoundingBoxDto } from "@/editor/types/dtos/WordBoundingBoxDto.ts";

export interface TextDto {
  id?: number;
  title?: string;
  foreignId?: number;
  wordBoundingBoxes?: WordBoundingBoxDto[];
  characterBoundingBoxes?: CharacterBoundingBoxDto[];
  backgroundImage?: string;
}
