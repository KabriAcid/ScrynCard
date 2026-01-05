import { NetworkDetector } from "../networkDetector";

describe("NetworkDetector", () => {
  describe("detect operator from phone number", () => {
    test("detects MTN from prefix 0703", () => {
      const result = NetworkDetector.detect("07031234567");
      expect(result.operator).toBe("MTN");
      expect(result.isValid).toBe(true);
    });

    test("detects MTN from prefix 0704", () => {
      const result = NetworkDetector.detect("07041234567");
      expect(result.operator).toBe("MTN");
      expect(result.isValid).toBe(true);
    });

    test("detects MTN from prefix 0706", () => {
      const result = NetworkDetector.detect("07061234567");
      expect(result.operator).toBe("MTN");
      expect(result.isValid).toBe(true);
    });

    test("detects Airtel from prefix 0701", () => {
      const result = NetworkDetector.detect("07011234567");
      expect(result.operator).toBe("Airtel");
      expect(result.isValid).toBe(true);
    });

    test("detects Airtel from prefix 0708", () => {
      const result = NetworkDetector.detect("07081234567");
      expect(result.operator).toBe("Airtel");
      expect(result.isValid).toBe(true);
    });

    test("detects Glo from prefix 0705", () => {
      const result = NetworkDetector.detect("07051234567");
      expect(result.operator).toBe("Glo");
      expect(result.isValid).toBe(true);
    });

    test("detects 9Mobile from prefix 0809", () => {
      const result = NetworkDetector.detect("08091234567");
      expect(result.operator).toBe("9Mobile");
      expect(result.isValid).toBe(true);
    });
  });

  describe("phone number validation", () => {
    test("accepts valid Nigerian phone starting with 0", () => {
      const result = NetworkDetector.detect("08067234567");
      expect(result.isValid).toBe(true);
    });

    test("accepts +234 format", () => {
      const result = NetworkDetector.detect("+2347031234567");
      expect(result.isValid).toBe(true);
    });

    test("rejects invalid format", () => {
      const result = NetworkDetector.detect("1234567890");
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBeDefined();
    });

    test("rejects short number", () => {
      const result = NetworkDetector.detect("070312345");
      expect(result.isValid).toBe(false);
    });

    test("rejects unknown prefix", () => {
      const result = NetworkDetector.detect("06031234567");
      expect(result.isValid).toBe(false);
    });
  });

  describe("phone number formatting", () => {
    test("formats +234 to 0 format", () => {
      const result = NetworkDetector.detect("+2347031234567");
      expect(result.phoneNumber).toBe("07031234567");
    });

    test("maintains 0 format", () => {
      const result = NetworkDetector.detect("07031234567");
      expect(result.phoneNumber).toBe("07031234567");
    });

    test("handles spaces in input", () => {
      const result = NetworkDetector.detect("0703 123 4567");
      expect(result.isValid).toBe(true);
      expect(result.phoneNumber).toBe("07031234567");
    });

    test("handles hyphens in input", () => {
      const result = NetworkDetector.detect("0703-123-4567");
      expect(result.isValid).toBe(true);
      expect(result.phoneNumber).toBe("07031234567");
    });
  });

  describe("getAllOperators", () => {
    test("returns all supported operators", () => {
      const operators = NetworkDetector.getAllOperators();
      expect(operators).toContain("MTN");
      expect(operators).toContain("Airtel");
      expect(operators).toContain("Glo");
      expect(operators).toContain("9Mobile");
      expect(operators.length).toBe(4);
    });
  });
});
