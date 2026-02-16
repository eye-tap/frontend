import type { AnnotationDto } from "@/types/dtos/AnnotationDto";
import type { AnnotationsMetaDataDto } from "@/types/dtos/AnnotationsMetaDataDto";
import type { ReadingSessionDto } from "@/types/dtos/ReadingSessionDto";

export interface AnnotationSessionDto {
  id?: number;
  annotator?: number;
  annotations?: AnnotationDto[];
  annotationsMetaData?: AnnotationsMetaDataDto;
  readingSession?: ReadingSessionDto;
  lastEdited?: string;
}
