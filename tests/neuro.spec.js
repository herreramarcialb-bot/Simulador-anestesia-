import { test, expect } from "@playwright/test";
import * as THREE from "three";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  NERVES,
  TECHNIQUES,
  FMA_TO_FDI,
  territoryTeeth,
  sidePoint,
  QUIZ_ORDER,
} from "../src/neuroData.js";

async function openModule(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${m.text()} ${m.location().url}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-model-loaded",
    "true",
  );
  await page.getByRole("button", { name: "Nervios", exact: true }).click();
  await page
    .getByRole("button", { name: "Ver a través del hueso", exact: true })
    .click();
  return errors;
}
async function colorPixels(page) {
  await page.locator("canvas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  return page.locator("canvas").evaluate((c) => {
    const g = c.getContext("webgl2"),
      p = new Uint8Array(c.width * c.height * 4);
    g.readPixels(0, 0, c.width, c.height, g.RGBA, g.UNSIGNED_BYTE, p);
    let blue = 0,
      pink = 0;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i],
        a = p[i + 1],
        b = p[i + 2];
      if (b > r * 1.25 && b > a * 1.05 && b > 130) blue++;
      if (r > a * 1.2 && b > a * 1.2 && r > b * 1.05) pink++;
    }
    return { blue, pink };
  });
}
async function clickNerve(page, id, index) {
  await page.locator("canvas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  const rect = await page.locator("canvas").boundingBox();
  const camera = new THREE.PerspectiveCamera(
      39,
      rect.width / rect.height,
      0.1,
      100,
    ),
    target = new THREE.Vector3(0, -1.3, 1.8);
  camera.position
    .set(0, 0.6, 10)
    .multiplyScalar(Math.max(1, 0.95 / (rect.width / rect.height)))
    .add(target);
  camera.lookAt(target);
  camera.updateMatrixWorld();
  const side = await page.locator("#neuro-side").inputValue();
  const points = NERVES[id].paths[0],
    p = points[index ?? Math.max(1, points.length - 2)];
  const point = id === "nasopalatine" ? p : sidePoint(p, side);
  const v = new THREE.Vector3(
    point[0] * 0.032,
    (point[1] - 1536.94) * 0.032,
    (point[2] - 96.4) * 0.032,
  ).project(camera);
  await page.locator("canvas").click({
    position: {
      x: ((v.x + 1) * rect.width) / 2,
      y: ((1 - v.y) * rect.height) / 2,
    },
  });
}
test("contratos anatómicos: atlas inalterado, FDI, pulpa y variantes", () => {
  expect(
    createHash("sha256")
      .update(readFileSync("public/models/bodyparts3d/craniofacial.glb"))
      .digest("hex"),
  ).toBe("09af5805ef666e48980a4c7de6fa6acbd035ee7dfaaab680f2b54cb2481d6437");
  expect(Object.keys(NERVES)).toHaveLength(10);
  expect(new Set(Object.values(FMA_TO_FDI)).size).toBe(28);
  for (const t of ["mental", "buccal", "lingual", "palatine", "nasopalatine"])
    expect(TECHNIQUES[t].pulp).toEqual([]);
  expect(territoryTeeth("ian", "left").pulp).toEqual([
    31, 32, 33, 34, 35, 36, 37,
  ]);
  expect(territoryTeeth("ian", "right").pulp).toEqual([
    41, 42, 43, 44, 45, 46, 47,
  ]);
  expect(territoryTeeth("psa", "left")).toEqual({ pulp: [27], partial: [26] });
  expect(territoryTeeth("infraorbital", "right")).toEqual({
    pulp: [11, 12, 13],
    partial: [14, 15, 16],
  });
  expect(TECHNIQUES.nasopalatine.bilateral).toBe(true);
  for (const [id, n] of Object.entries(NERVES)) {
    expect(n.origin.length).toBeGreaterThan(10);
    expect(n.teeth.length).toBeGreaterThan(10);
    for (const t of n.techniques) expect(TECHNIQUES[t]).toBeDefined();
    for (const path of n.paths)
      expect(path.flat().every(Number.isFinite)).toBe(true);
  }
});
test("territorios, fichas y diez interruptores: pulpa distinta de tejidos blandos", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors = await openModule(page);
  await expect(page.locator(".neuro-list .structure-row")).toHaveCount(10);
  await expect(page.locator(".neuro-scene-notice")).toContainText(
    "aproximados",
  );
  for (const n of Object.values(NERVES)) {
    const toggle = page.getByRole("switch", {
      name: `Mostrar nervio ${n.name}`,
      exact: true,
    });
    const previous = await toggle.getAttribute("aria-checked");
    await toggle.click();
    await expect(toggle).toHaveAttribute(
      "aria-checked",
      previous === "true" ? "false" : "true",
    );
  }
  await page.getByRole("button", { name: "Mentoniano", exact: true }).click();
  await expect(page.locator(".nerve-facts")).toContainText(
    "NO anestesia sus pulpas",
  );
  await expect(page.locator(".nerve-facts")).toContainText("Rama terminal");
  await page
    .getByRole("button", { name: "Ocultar todos", exact: true })
    .click();
  await page
    .getByLabel("Visualizar territorio anestésico", { exact: true })
    .check();
  await page.waitForTimeout(250);
  const ian = await colorPixels(page);
  expect(ian.blue).toBeGreaterThan(30);
  expect(ian.pink).toBeGreaterThan(30);
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("mental");
  await expect(page.locator(".territory-facts")).toContainText(
    "Sin anestesia pulpar",
  );
  await page.waitForTimeout(250);
  expect((await colorPixels(page)).blue).toBeLessThan(10);
  expect((await colorPixels(page)).pink).toBeGreaterThan(30);
  await page.getByLabel("Tejidos blandos", { exact: true }).uncheck();
  await page.waitForTimeout(250);
  expect((await colorPixels(page)).pink).toBeLessThan(10);
  await page.getByLabel("Tejidos blandos", { exact: true }).check();
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("ian");
  await page
    .getByLabel("Lado del paciente", { exact: true })
    .selectOption("right");
  await expect(page.locator(".territory-facts")).toContainText(
    "41, 42, 43, 44, 45, 46, 47",
  );
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("psa");
  await expect(page.locator(".territory-facts")).toContainText(
    "Cobertura parcial/variable: 16",
  );
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("nasopalatine");
  await expect(page.locator(".territory-card")).toContainText("bilateral");
  await expect(page.locator(".territory-facts")).toContainText(
    "Sin anestesia pulpar",
  );
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("ian");
  await page
    .getByLabel("Lado del paciente", { exact: true })
    .selectOption("left");
  await page
    .getByRole("button", {
      name: "Mostrar nervios de esta técnica",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("switch", {
      name: "Mostrar nervio Alveolar inferior",
      exact: true,
    }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByRole("switch", {
      name: "Mostrar nervio Bucal largo",
      exact: true,
    }),
  ).toHaveAttribute("aria-checked", "false");
  await page
    .getByRole("button", { name: "Alveolar inferior", exact: true })
    .click();
  await page.screenshot({
    path: "test-results/neuro-territorio.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("actividad: raycasting sobre nervios, error, acierto único y cinco preguntas", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors = await openModule(page);
  await page
    .getByRole("button", { name: "Iniciar actividad", exact: true })
    .click();
  await page.getByRole("button", { name: "Frontal", exact: true }).click();
  await expect(page.locator(".quiz-list-hidden")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Alveolar inferior", exact: true }),
  ).toHaveCount(0);
  await clickNerve(page, "mental");
  await expect(page.locator(".quiz-feedback")).toContainText(
    "Has seleccionado Mentoniano",
  );
  await expect(page.locator(".quiz-progress")).toContainText(
    "0 aciertos · 1 intentos",
  );
  for (const id of QUIZ_ORDER) {
    await clickNerve(page, id, id === "ian" ? 3 : undefined);
    await expect(page.locator(".quiz-feedback")).toContainText("Correcto.");
    if (id === "ian") {
      await clickNerve(page, "ian", 3);
      await expect(page.locator(".quiz-progress")).toContainText(
        "1 aciertos · 2 intentos",
      );
    }
    await page
      .getByRole("button", {
        name: id === "mental" ? "Ver resultado" : "Siguiente nervio",
        exact: true,
      })
      .click();
  }
  await expect(page.locator(".quiz-result")).toContainText(
    "5 de 5 nervios identificados en 6 intentos",
  );
  await expect(page.locator(".neuro-list")).toBeVisible();
  expect(errors).toEqual([]);
});
test("módulo móvil: controles utilizables y sin desbordamiento horizontal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = await openModule(page);
  await page
    .getByLabel("Visualizar territorio anestésico", { exact: true })
    .check();
  await page
    .getByLabel("Técnica anestésica", { exact: true })
    .selectOption("palatine");
  await expect(page.locator(".territory-facts")).toContainText(
    "Sin anestesia pulpar",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/neuro-movil.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
