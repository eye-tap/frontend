import type { ImportFixationDto } from "@/editor/types/dtos/ImportFixationDto.ts";

export interface ImportReadingSessionDto {
  fixations?: ImportFixationDto[];
  readerForeignId?: number;
  textForeignId?: number;
  foreignId?: number;
}
