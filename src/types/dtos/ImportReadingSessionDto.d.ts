import type { ImportFixationDto } from "@/types/dtos/ImportFixationDto.ts";
import type { ImportPreAnnotationDto } from "@/types/dtos/ImportPreAnnotationDto.ts";

export interface ImportReadingSessionDto {
  fixations?: ImportFixationDto[];
  readerForeignId?: number;
  textForeignId?: number;
  preAnnotations?: ImportPreAnnotationDto[];
}
