import { describe, it, expect } from "vitest";
import { BopiClient, BopiUnavailableError } from "../../src/sources/bopi.js";

describe("BopiClient", () => {
  it("dernieresPublications retourne ou explique l'indisponibilité", async () => {
    const client = new BopiClient();
    try {
      const out = await client.dernieresPublications({ type: "tous", semaines: 1 });
      expect(Array.isArray(out.publications)).toBe(true);
    } catch (e) {
      expect(e).toBeInstanceOf(BopiUnavailableError);
    }
  });
});
