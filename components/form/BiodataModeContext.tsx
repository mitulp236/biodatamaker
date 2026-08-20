"use client";

import { createContext, useContext } from "react";

interface BiodataMode {
  mode: "local" | "remote";
  biodataId: string | null;
}

const BiodataModeContext = createContext<BiodataMode>({ mode: "local", biodataId: null });

export const BiodataModeProvider = BiodataModeContext.Provider;

export function useBiodataMode() {
  return useContext(BiodataModeContext);
}
