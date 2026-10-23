import { it, expect } from "vitest";
import texts from "../data/interpretations.cs.json";
import { lines } from "../config/rules";
const content = texts as Record<string, (typeof texts)["life:1"]>;
it("obsahuje všechny požadované interpretace a metadata", () => {
  const ids: string[] = [];
  for (let n = 1; n <= 9; n++) {
    for (let count = 0; count <= 4; count++) ids.push(`count:${n}:${count}`);
    for (const kind of ["life", "year", "month", "day"])
      ids.push(`${kind}:${n}`);
  }
  for (const n of [11, 22, 33]) ids.push(`life:${n}`);
  for (const line of lines)
    for (let count = 0; count < 4; count++)
      ids.push(`line:${line.id}:${count}`);
  for (let n = 0; n <= 8; n++) ids.push(`challenge:${n}`);
  for (const id of ids) {
    expect(content[id], id).toBeDefined();
    for (const key of [
      "title",
      "short",
      "long",
      "potential",
      "activity",
      "sourceId",
    ] as const)
      expect(content[id][key].length, id).toBeGreaterThan(0);
    expect(content[id].sourceRefs.length).toBeGreaterThan(0);
    expect(content[id].evidenceLevel).toBe("editorial_synthesis");
  }
});
