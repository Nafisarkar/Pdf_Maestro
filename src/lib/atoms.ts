import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
export const pdfUrlAtom = atom<string | null>(null);
export const numPagesAtom = atom<number>(0);
export const pageNumberAtom = atom<number>(1);
export const scaleAtom = atom<number>(1.0);

export type Tool = "pan" | "highlighter" | "select";
export const toolAtom = atom<Tool>("select");



export const userSettingsAtom = atomWithStorage("user-settings", {
  darkmode: true,
  hidedevinfo: true,
  showfloatingtoolbar: true,
});
