type SheetRow = any[];

export type SheetContentType = SheetRow[];

export interface SheetDataType {
  addOn: SheetContentType;
  discounts: SheetContentType;
  lens: SheetContentType;
  lensTreatment: SheetContentType;
  mcssAddon: SheetContentType;
  packages: SheetContentType;
  superflexAddon: SheetContentType;
}
