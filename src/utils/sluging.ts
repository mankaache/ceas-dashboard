export function sluging(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")                 // split accents from letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/['’"]/g, "")           // remove quotes
    .replace(/[^a-z0-9]+/g, "-")     // replace EVERYTHING else with -
    .replace(/^-+|-+$/g, "");        // trim dashes
}
