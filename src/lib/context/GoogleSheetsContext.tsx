"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getGoogleSheetData } from "@/services/getGoogleData";
import { SheetDataType } from "@/app/_types/DataTypes";

interface GoogleSheetsContextType {
  sheetsData: SheetDataType;
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
  const [sheetsData, setSheetsData] = useState<SheetDataType>({
    addOn: [],
    discounts: [],
    lens: [],
    lensTreatment: [],
    mcssAddon: [],
    packages: [],
    superflexAddon: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheetsData = async () => {
      try {
        const data: Record<string, any[][]> = await getGoogleSheetData();
        const transformedData = transformToSheetData(data);
        console.log("transformedData", transformedData);
        setSheetsData(transformedData);
      } catch (err: unknown) {
        // Now you MUST check the type of 'err' before using its properties
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        } else if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof err.message === "string"
        ) {
          errorMessage = err.message;
        }

        setError(errorMessage || "Failed to fetch sheets data");
      } finally {
        setLoading(false);
      }
    };

    fetchSheetsData();
  }, []);

  function transformToSheetData(rawData: Record<string, any[][]>): SheetData {
    return {
      lens: rawData.lens || [],
      discounts: rawData.discounts || [],
      packages: rawData.packages || [],
      lensTreatment: rawData.lensTreatment || [],
      addOn: rawData.addon || [],
      superflexAddon: rawData.superflexAddon || [],
      mcssAddon: rawData.mcssAddon || [],
    };
  }
  // const addSheetData = (sheetName: string, data: any[]) => {
  //   setSheetsData((prev) => ({ ...prev, [sheetName]: data }));
  // };

  return (
    <GoogleSheetsContext.Provider value={{ sheetsData, loading, error }}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export function useGoogleSheetsContext() {
  return useContext(GoogleSheetsContext);
}
