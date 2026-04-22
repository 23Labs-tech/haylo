export interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: "Male" | "Female";
  default?: boolean;
}

export const VOICE_OPTIONS: Voice[] = [
  {
    id: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    accent: "Australian",
    gender: "Female",
    default: true,
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    accent: "Australian",
    gender: "Female",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    accent: "Neutral",
    gender: "Female",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    accent: "Neutral",
    gender: "Female",
  },
  {
    id: "bIHbv24MWmeRgasZH58o",
    name: "Will",
    accent: "American",
    gender: "Male",
  },
];

export const DEFAULT_VOICE_ID = VOICE_OPTIONS.find((v) => v.default)?.id || "XB0fDUnXU5powFXDhCwa";
