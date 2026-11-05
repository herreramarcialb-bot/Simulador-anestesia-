import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const notice =
  "SIMULADOR EXCLUSIVAMENTE EDUCATIVO. LOS CASOS SON FICTICIOS Y NO SUSTITUYEN LA VALORACIÓN CLÍNICA PROFESIONAL";

async function ready(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-model-loaded", "true");
  await expect(canvas).toHaveAttribute("data-mesh-count", "50");
  await expect(page.locator(".canvas-error")).toHaveCount(0);
  await page.waitForFunction(() => {
    const c = document.querySelector("canvas"),
      gl = c.getContext("webgl2");
    const p = new Uint8Array(c.width * c.height * 4);
    gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, p);
    let bone = 0;
    for (let i = 0; i < p.length; i += 4)
      if (p[i] > 120 && p[i] < 245 && p[i + 1] > 110 && p[i + 2] < p[i] - 8)
        bone++;
    return bone > 1500;
  });
  return { canvas, errors };
}
test("GLB local íntegro: 22 huesos, 28 dientes e identificadores de procedencia", () => {
  const bytes = readFileSync("public/models/bodyparts3d/craniofacial.glb");
  const manifest = JSON.parse(
    readFileSync("public/models/bodyparts3d/manifest.json"),
  );
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(
    manifest.glbSha256,
  );
  expect(bytes.readUInt32LE(0)).toBe(0x46546c67);
  expect(bytes.readUInt32LE(8)).toBe(bytes.length);
  const json = JSON.parse(
    bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString(),
  );
  expect(json.meshes).toHaveLength(50);
  expect(
    json.nodes.filter((n) => n.extras.anatomyKey === "teeth"),
  ).toHaveLength(28);
  expect(
    json.nodes.filter((n) => n.extras.anatomyKey === "skull"),
  ).toHaveLength(19);
  expect(
    json.nodes.filter((n) => n.extras.anatomyKey === "maxilla"),
  ).toHaveLength(2);
  expect(
    json.nodes.filter((n) => n.extras.anatomyKey === "mandible"),
  ).toHaveLength(1);
  expect(new Set(json.nodes.map((n) => n.extras.fma)).size).toBe(50);
  expect(manifest.parts.reduce((sum, p) => sum + p.triangles, 0)).toBe(441936);
  for (const part of manifest.parts) {
    expect(part.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(part.sourceUrl).toContain(manifest.mirrorCommit);
    expect(part.bounds.flat().every(Number.isFinite)).toBe(true);
  }
});
test("atlas en Chromium: selección, visibilidad, transparencia, cámara y jeringa", async ({
  page,
}) => {
  const { canvas, errors } = await ready(page);
  await page.screenshot({
    path: "test-results/atlas-escritorio.png",
    fullPage: true,
  });
  await expect(page.locator(".educational-notice")).toHaveText(notice);
  await expect(page.locator(".model-credits")).toContainText(
    "CC BY-SA 2.1 Japan",
  );
  const before = await canvas.screenshot();
  await page
    .getByRole("switch", { name: "Mostrar Cráneo", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Mostrar Cráneo", exact: true }),
  ).toHaveAttribute("aria-checked", "false");
  await page.waitForTimeout(200);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.getByRole("button", { name: "Cráneo", exact: true }).click();
  await page.getByRole("button", { name: "Mandíbula", exact: true }).click();
  await expect(page.locator(".selection-detail h2")).toHaveText("Mandíbula");
  const box = await canvas.boundingBox();
  await canvas.click({
    position: { x: box.width * 0.5, y: box.height * 0.34 },
  });
  await expect(page.locator(".selection-detail h2")).toHaveText("Cráneo");
  await page.locator("#bone-opacity").fill("0.25");
  await expect(page.locator(".opacity-section")).toContainText("75%");
  await page.waitForTimeout(200);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.locator("#bone-opacity").fill("1");
  await page.getByRole("button", { name: "Lateral", exact: true }).click();
  await page.waitForTimeout(300);
  const side = await canvas.screenshot();
  expect(side.equals(before)).toBe(false);
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.6, {
    steps: 8,
  });
  await page.mouse.up();
  await page.mouse.wheel(0, -160);
  await page.getByRole("button", { name: "Jeringa", exact: true }).click();
  await page.getByLabel("Posición X", { exact: true }).fill("1.5");
  await page.getByLabel("Rotación", { exact: true }).fill("45");
  await expect(page.locator(".syringe-controls")).toContainText("45°");
  await page.getByRole("button", { name: "Restablecer", exact: true }).click();
  await expect(page.getByLabel("Posición X", { exact: true })).toHaveValue(
    "3.8",
  );
  await page.getByRole("button", { name: "Iniciar recorrido" }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.locator(".lesson-card h3")).toHaveText(
    "Relaciona el territorio sensitivo",
  );
  await page
    .getByRole("button", { name: "Ampliar visor", exact: true })
    .click();
  await expect(page.locator(".app")).toHaveClass(/focus-mode/);
  await page.getByRole("button", { name: "Salir de vista ampliada" }).click();
  await page.getByRole("button", { name: "Ayuda", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).not.toContainText("nervio amarillo");
  await page.getByRole("button", { name: "Cerrar ayuda" }).click();
  expect(errors).toEqual([]);
});
test("atlas móvil: modelo cargado, aviso visible y sin desbordamiento", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { errors } = await ready(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".educational-notice")).toHaveText(notice);
  await page.getByRole("button", { name: "Jeringa", exact: true }).click();
  await expect(page.getByLabel("Altura Y", { exact: true })).toHaveValue("-1");
  await page.screenshot({
    path: "test-results/atlas-movil.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
