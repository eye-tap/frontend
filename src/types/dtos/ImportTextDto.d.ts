import type { ImportCharacterBoundingBoxDto } from "@/types/dtos/ImportCharacterBoundingBoxDto.ts";
import type { ImportWordBoundingBoxDto } from "@/types/dtos/ImportWordBoundingBoxDto.ts";

export interface ImportTextDto {
  title?: string;
  foreignId?: number;
  characterBoundingBoxes?: ImportCharacterBoundingBoxDto[];
  wordBoundingBoxes?: ImportWordBoundingBoxDto[];
  backgroundImage?: string;
}
