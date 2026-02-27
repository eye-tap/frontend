import type { AnnotationsMetaDataDto } from "@/types/dtos/AnnotationsMetaDataDto";
import type { ShallowReadingSessionDto } from "@/types/dtos/ShallowReadingSessionDto";

export interface ShallowAnnotationSessionDto {
  id?: number;
  annotator?: number;
  annotationsMetaData?: AnnotationsMetaDataDto;
  readingSession?: ShallowReadingSessionDto;
  lastEdited?: string;
  description?: string;
}
