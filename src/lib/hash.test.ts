import { describe, it, expect } from "vitest";
import { calculateRecordHash } from "./hash";

describe("Hash utilities", () => {
  it("should calculate identical hashes for objects with same keys regardless of insertion order", () => {
    const obj1 = { name: "Test", value: 123, active: true };
    const obj2 = { value: 123, active: true, name: "Test" };
    
    const hash1 = calculateRecordHash(obj1);
    const hash2 = calculateRecordHash(obj2);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex is 64 chars
  });
  
  it("should calculate different hashes for different objects", () => {
    const obj1 = { name: "Test", value: 123 };
    const obj2 = { name: "Test", value: 124 };
    
    expect(calculateRecordHash(obj1)).not.toBe(calculateRecordHash(obj2));
  });
});
