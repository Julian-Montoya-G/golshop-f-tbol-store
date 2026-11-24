import { describe, expect, it } from "vitest";
import { formatCOP, shippingFor } from "@/lib/golshop-data";

describe("GolShop precios", () => {
  it("formatea pesos colombianos con punto de miles y sin decimales", () => {
    expect(formatCOP(329900)).toBe("$329.900");
    expect(formatCOP(1519800)).toBe("$1.519.800");
  });

  it("cobra envío por debajo de $400.000 y lo regala desde ahí", () => {
    expect(shippingFor(329900)).toBe(12000);
    expect(shippingFor(400000)).toBe(0);
    expect(shippingFor(0)).toBe(0);
  });
});
