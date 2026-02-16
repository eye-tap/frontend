import type { ImportCharacterBoundingBoxDto } from "@/types/dtos/ImportCharacterBoundingBoxDto";
import type { ImportWordBoundingBoxDto } from "@/types/dtos/ImportWordBoundingBoxDto";

export interface ImportTextDto {
  title?: string;
  foreignId?: number;
  characterBoundingBoxes?: ImportCharacterBoundingBoxDto[];
  wordBoundingBoxes?: ImportWordBoundingBoxDto[];
  backgroundImage?: string;
}
