import { describe, it, expect } from "vitest";
import { formatCop, formatDateEs, formatDateTimeEs } from "./format";

describe("Formatting Utils", () => {
  it("formats COP correctly", () => {
     
    expect(formatCop(1500000)).toMatch(/\$\s?1\.500\.000/);
  });

  it("formats date correctly", () => {
    expect(formatDateEs(new Date(2026, 9, 7, 12, 0, 0))).toBe("07/10/2026");
  });

  it("formats datetime correctly", () => {
    expect(formatDateTimeEs(new Date(2026, 9, 7, 12, 0, 0))).toBe("07/10/2026 12:00");
  });
});
