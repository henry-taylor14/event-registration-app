export const normalizeGroupName = (name: string) =>
    name.trim().toLowerCase().replace(/[^a-z0-9]/gi, '');