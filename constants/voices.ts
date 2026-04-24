export interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: "Male" | "Female";
  previewUrl?: string;
  default?: boolean;
}

export const VOICE_OPTIONS: Voice[] = [
  {
    id: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    accent: "Australian",
    gender: "Female",
    previewUrl: "https://cdn.elevenlabs.io/v1/voices/XB0fDUnXU5powFXDhCwa/preview.mp3",
    default: true,
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    accent: "Australian",
    gender: "Female",
    previewUrl: "https://cdn.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview.mp3",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    accent: "Neutral",
    gender: "Female",
    previewUrl: "https://cdn.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/preview.mp3",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    accent: "Neutral",
    gender: "Female",
    previewUrl: "https://cdn.elevenlabs.io/v1/voices/AZnzlk1XvdvUeBnXmlld/preview.mp3",
  },
  {
    id: "bIHbv24MWmeRgasZH58o",
    name: "Will",
    accent: "American",
    gender: "Male",
    previewUrl: "https://cdn.elevenlabs.io/v1/voices/bIHbv24MWmeRgasZH58o/preview.mp3",
  },
];

export const DEFAULT_VOICE_ID = VOICE_OPTIONS.find((v) => v.default)?.id || "XB0fDUnXU5powFXDhCwa";
