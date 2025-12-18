export const MIME_TYPES = {
  IMAGE: ["image/jpeg", "image/jpg", "image/png", "image/webp"],

  AUDIO: [
    "audio/mpeg",
    "audio/wave",
    "audio/wav",
    "audio/flac",
    "audio/mp4",
    "audio/aac",
    "audio/ogg",
    "audio/opus",
    "audio/amr",
    "audio/aiff",
    "audio/webm",
  ],

  VIDEO: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-matroska",
  ],

  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

export const Allowed_File_Types = {
  IMAGE: MIME_TYPES.IMAGE,
  PROFILES: MIME_TYPES.IMAGE,
};

export const Public_File_Modules = {
  IMAGE: "image",
};

export const File_Modules = {
  ...Public_File_Modules,
  PROFILES: "profiles",
};

export const File_Max_Sizes = {
  IMAGE: 2,
  PROFILES: 5,
};
