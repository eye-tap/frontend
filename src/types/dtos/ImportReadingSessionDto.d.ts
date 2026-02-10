import type { ImportFixationDto } from "@/types/dtos/ImportFixationDto.ts";

export interface ImportReadingSessionDto {
  fixations?: ImportFixationDto[];
  readerForeignId?: number;
  textForeignId?: number;
}
