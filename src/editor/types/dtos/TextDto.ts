import type { WordBoundingBoxDto } from "@/editor/types/dtos/WordBoundingBoxDto.ts";
import type { CharacterBoundingBoxDto } from "@/editor/types/dtos/CharacterBoundingBoxDto.ts";

export interface TextDto {
  id?: number;
  title?: string;
  foreignId?: number;
  wordBoundingBoxes?: WordBoundingBoxDto[];
  characterBoundingBoxes?: CharacterBoundingBoxDto[];
  backgroundImage?: string;
}
