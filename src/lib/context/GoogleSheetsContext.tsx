"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getGoogleSheetData } from "@/services/getGoogleData";

interface SheetData {
  [key: string]: any[];
}

interface GoogleSheetsContextType {
  sheetsData: SheetData;
  loading: boolean;
  error: string | null;
}

// Create the context
const GoogleSheetsContext = createContext<GoogleSheetsContextType | undefined>(
  undefined
);

export const GoogleSheetsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sheetsData, setSheetsData] = useState<SheetData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheetsData = async () => {
      try {
        setLoading(true);
        const data = await getGoogleSheetData();
        setSheetsData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sheets data");
      } finally {
        setLoading(false);
      }
    };

    fetchSheetsData();
  }, []);

  const addSheetData = (sheetName: string, data: any[]) => {
    setSheetsData((prev) => ({ ...prev, [sheetName]: data }));
  };

  return (
    <GoogleSheetsContext.Provider value={{ sheetsData, loading, error }}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export function useGoogleSheetsContext() {
  return useContext(GoogleSheetsContext);
}
