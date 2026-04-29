import fs from "node:fs";
import path from "node:path";

const GENERATED_PATH = path.join(
  process.cwd(),
  "src/@fontsensei/data/generated/fontDataFolder.ts",
);
const EXAMPLE_PATH = path.join(
  process.cwd(),
  "src/@fontsensei/data/generated/fontDataFolder.example.ts",
);

if (!fs.existsSync(GENERATED_PATH)) {
  if (!fs.existsSync(EXAMPLE_PATH)) {
    throw new Error(
      `Missing both generated and example font data folder files:\n- ${GENERATED_PATH}\n- ${EXAMPLE_PATH}`,
    );
  }

  fs.copyFileSync(EXAMPLE_PATH, GENERATED_PATH);
  // eslint-disable-next-line no-console
  console.log("ensureFontDataFolder: created fontDataFolder.ts from example");
}

