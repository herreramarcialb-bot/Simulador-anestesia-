import { test, expect } from "@playwright/test";
test("escena WebGL, estructuras, cámara, jeringa y recorrido educativo", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await page.waitForFunction(() => {
    const c = document.querySelector("canvas");
    const gl = c?.getContext("webgl2");
    if (!gl) return false;
    const data = new Uint8Array(c.width * c.height * 4);
    gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    let yellow = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (
        data[i] > 140 &&
        data[i + 1] > 80 &&
        data[i + 1] < 210 &&
        data[i + 2] < 130
      )
        yellow++;
    }
    return yellow > 100;
  });
  await page.screenshot({ path: "test-results/simulador-escritorio.png" });
  const first = await canvas.screenshot();
  await page
    .getByRole("switch", {
      name: "Mostrar Nervio alveolar inferior",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("switch", {
      name: "Mostrar Nervio alveolar inferior",
      exact: true,
    }),
  ).toHaveAttribute("aria-checked", "false");
  await page.waitForTimeout(250);
  expect((await canvas.screenshot()).equals(first)).toBe(false);
  await page
    .getByRole("button", { name: "Nervio alveolar inferior", exact: true })
    .click();
  await expect(
    page.getByRole("switch", {
      name: "Mostrar Nervio alveolar inferior",
      exact: true,
    }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Mandíbula", exact: true }).click();
  await expect(page.locator(".selection-detail h2")).toHaveText("Mandíbula");

  for (const name of ["Mandíbula", "Maxilar", "Dientes"])
    await page
      .getByRole("switch", { name: `Mostrar ${name}`, exact: true })
      .click();
  await page.waitForTimeout(300);
  const nervePixel = await canvas.evaluate((c) => {
    const gl = c.getContext("webgl2");
    const d = new Uint8Array(c.width * c.height * 4);
    gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, d);
    const points = [];
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        if (
          d[i] > 150 &&
          d[i + 1] > 90 &&
          d[i + 1] < 210 &&
          d[i + 2] < 100 &&
          d[i] > d[i + 1] * 1.1
        )
          points.push([x, y]);
      }
    const p = points[Math.floor(points.length / 2)];
    return p
      ? {
          x: (p[0] * c.clientWidth) / c.width,
          y: ((c.height - p[1]) * c.clientHeight) / c.height,
        }
      : null;
  });
  expect(nervePixel).not.toBeNull();
  await canvas.click({ position: nervePixel });
  await expect(page.locator(".selection-detail h2")).toHaveText(
    "Nervio alveolar inferior",
  );
  for (const name of ["Mandíbula", "Maxilar", "Dientes"])
    await page
      .getByRole("switch", { name: `Mostrar ${name}`, exact: true })
      .click();
  await page.locator("#bone-opacity").fill("0.25");
  await expect(page.locator(".opacity-section")).toContainText("75%");
  const before = await canvas.screenshot();
  await page.getByRole("button", { name: "Lateral", exact: true }).click();
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  const rect = await canvas.boundingBox();
  await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.6);
  await page.mouse.down();
  await page.mouse.move(
    rect.x + rect.width * 0.65,
    rect.y + rect.height * 0.5,
    { steps: 12 },
  );
  await page.mouse.up();
  await page.mouse.wheel(0, -180);
  await page.getByRole("button", { name: "Jeringa", exact: true }).click();
  await page.getByLabel("Posición X").fill("1.5");
  await page.getByLabel("Rotación", { exact: true }).fill("45");
  await expect(page.locator(".syringe-controls")).toContainText("45°");
  await page.getByRole("button", { name: "Restablecer", exact: true }).click();
  await expect(page.getByLabel("Posición X")).toHaveValue("3.5");
  await page.getByRole("button", { name: "Iniciar recorrido" }).click();
  await expect(page.locator(".lesson-card")).toBeVisible();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.locator(".lesson-card h3")).toHaveText(
    "Relaciona el territorio sensitivo",
  );
  await page.getByRole("button", { name: "Reiniciar recorrido" }).click();
  await expect(page.locator(".lesson-card h3")).toHaveText(
    "Reconoce la anatomía",
  );
  await page
    .getByRole("button", { name: "Ampliar visor", exact: true })
    .click();
  await expect(page.locator(".app")).toHaveClass(/focus-mode/);
  await page.getByRole("button", { name: "Salir de vista ampliada" }).click();
  await page.getByRole("button", { name: "Ayuda", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar ayuda" }).click();
  expect(errors).toEqual([]);
});
test("interfaz móvil sin desbordamientos y controles accesibles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Jeringa", exact: true }).click();
  await expect(page.getByLabel("Altura Y")).toBeVisible();
  await page.screenshot({
    path: "test-results/simulador-movil.png",
    fullPage: true,
  });
});
