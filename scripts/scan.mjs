#!/usr/bin/env node
/**
 * ESCÁNER DE MÓDULOS
 * -------------------
 * Genera un archivo Markdown con el código de UN módulo (+ código compartido)
 * o de TODA la app, listo para pegarle a un LLM.
 *
 * Uso:
 *   npm run scan                -> escanea toda la app
 *   npm run scan -- finanzas    -> escanea solo el módulo "finanzas" (+ shared)
 *   node scripts/scan.mjs salud -> equivalente directo sin npm
 *
 * No requiere dependencias externas (solo Node.js >= 18).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ============================================================
// 1. CONFIGURACIÓN — AJUSTA ESTO A TU PROYECTO REAL
// ============================================================
const ROOT = process.cwd(); // ejecuta el script desde la raíz del proyecto

const CONFIG = {
  // Nombre de carpeta que se considera "raíz de módulos". El script busca
  // TODAS las carpetas con este nombre en el proyecto (raíz, src/, etc.),
  // sin importar dónde estén — así no importa si tienes duplicados o si
  // moviste la carpeta y quedaron restos en otro lado.
  modulesDirName: "modules",

  // Nombre de carpeta que se considera "código compartido". Igual que
  // arriba: se buscan TODAS las que existan. Las que estén DENTRO de un
  // módulo (ej: src/modules/dashboard/shared) no se listan aparte porque
  // ya se incluyen solas al escanear ese módulo.
  sharedDirName: "shared",

  // Archivos de configuración de raíz que dan contexto útil al LLM
  rootConfigFiles: [
    "package.json",
    "tsconfig.json",
    "tailwind.config.ts",
    "tailwind.config.js",
    "vite.config.ts",
  ],

  // Extensiones de archivo que se incluyen en el escaneo
  includeExtensions: [".ts", ".tsx", ".js", ".jsx", ".css"],

  // Carpetas que jamás se recorren
  excludeDirs: new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    ".next",
    ".turbo",
  ]),

  // Archivo con las reglas/convenciones del proyecto ("contrato de desarrollo")
  contractFile: "SCANNER_CONTRACT.md",

  // Dónde se guarda el resultado
  outputDir: "scan-output",
};

// ============================================================
// 2. UTILIDADES
// ============================================================

function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function walk(relDir, collected = []) {
  const abs = path.join(ROOT, relDir);
  if (!fs.existsSync(abs)) return collected;

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const relPath = path.join(relDir, entry.name);
    if (entry.isDirectory()) {
      if (CONFIG.excludeDirs.has(entry.name)) continue;
      walk(relPath, collected);
    } else {
      const ext = path.extname(entry.name);
      if (CONFIG.includeExtensions.includes(ext)) {
        collected.push(relPath);
      }
    }
  }
  return collected;
}

// Busca TODAS las carpetas con un nombre exacto en cualquier parte del
// proyecto (respetando excludeDirs), devolviendo rutas relativas a ROOT.
function findAllDirsNamed(targetName, dir = "", results = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return results;

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (CONFIG.excludeDirs.has(entry.name)) continue;

    const relPath = dir ? path.join(dir, entry.name) : entry.name;
    if (entry.name === targetName) results.push(relPath);
    // sigue bajando igual, para encontrar anidados (ej: shared dentro de un módulo)
    findAllDirsNamed(targetName, relPath, results);
  }
  return results;
}

// Devuelve: { moduleMap: { nombre: [rutas...] }, moduleRoots: [...] }
function discoverModules() {
  const moduleRoots = findAllDirsNamed(CONFIG.modulesDirName);
  const moduleMap = {};

  for (const root of moduleRoots) {
    const abs = path.join(ROOT, root);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (CONFIG.excludeDirs.has(entry.name)) continue;
      const modPath = path.join(root, entry.name);
      moduleMap[entry.name] = moduleMap[entry.name] || [];
      moduleMap[entry.name].push(modPath);
    }
  }

  return { moduleMap, moduleRoots };
}

// Carpetas "shared" globales = todas las que existan, EXCEPTO las que
// están dentro de alguna ruta de módulo (esas ya viajan con su módulo).
function discoverGlobalSharedDirs(allModulePaths) {
  const allShared = findAllDirsNamed(CONFIG.sharedDirName);
  return allShared.filter(
    (s) => !allModulePaths.some((mp) => s === mp || s.startsWith(mp + path.sep))
  );
}

function buildTree(files) {
  // Árbol simple ordenado alfabéticamente
  return files
    .slice()
    .sort()
    .map((f) => `- ${f}`)
    .join("\n");
}

function readOrCreateContract() {
  if (exists(CONFIG.contractFile)) {
    return fs.readFileSync(path.join(ROOT, CONFIG.contractFile), "utf-8");
  }

  const template = `# Contrato de desarrollo del proyecto

> Este archivo se incluye automáticamente en cada escaneo para que cualquier
> LLM entienda las reglas del proyecto antes de tocar código. Complétalo con
> tus convenciones reales.

## Stack
- React + TypeScript + Tailwind CSS + IndexedDB

## Convenciones de módulos
- Cada módulo vive en \`src/modules/<nombre>\` y es independiente.
- El código compartido entre módulos vive en \`src/shared\`, \`src/hooks\`, \`src/lib\`, \`src/types\`.
- (Agrega aquí tus reglas de nombres, estructura interna de cada módulo, patrones de estado, etc.)

## Estilo de código
- (Ej: componentes funcionales, hooks personalizados con prefijo use..., etc.)

## Reglas de IndexedDB
- (Ej: cada módulo define su propio store, nomenclatura de las bases, migraciones, etc.)
`;

  fs.mkdirSync(ROOT, { recursive: true });
  fs.writeFileSync(path.join(ROOT, CONFIG.contractFile), template, "utf-8");
  console.log(
    `\n📄 No existía "${CONFIG.contractFile}" — se creó una plantilla. Complétala para mejores resultados.\n`
  );
  return template;
}

function fenceFor(file) {
  const ext = path.extname(file).slice(1);
  const map = { ts: "tsx", tsx: "tsx", js: "jsx", jsx: "jsx", css: "css" };
  return map[ext] || "";
}

// ============================================================
// 3. LÓGICA PRINCIPAL
// ============================================================

function main() {
  const requestedModule = process.argv[2];
  const { moduleMap, moduleRoots } = discoverModules();
  const availableModules = Object.keys(moduleMap).sort();

  let filesToScan = [];
  let scanLabel = "";
  let duplicateWarnings = [];

  // Detecta módulos con el mismo nombre en más de una ruta (posible duplicado por error)
  for (const [name, paths] of Object.entries(moduleMap)) {
    if (paths.length > 1) {
      duplicateWarnings.push(
        `⚠️ El módulo "${name}" existe en ${paths.length} rutas distintas: ${paths.join(
          " , "
        )} — probablemente un duplicado por error. Se incluyó el código de TODAS esas rutas para que lo revises.`
      );
    }
  }

  if (requestedModule) {
    if (!availableModules.includes(requestedModule)) {
      console.error(`\n❌ El módulo "${requestedModule}" no existe.`);
      console.error(
        `   Módulos detectados actualmente: ${
          availableModules.join(", ") || "(ninguno todavía)"
        }\n`
      );
      process.exit(1);
    }
    scanLabel = requestedModule;
    for (const modPath of moduleMap[requestedModule]) {
      filesToScan.push(...walk(modPath));
    }
  } else {
    scanLabel = "app-completa";
    for (const paths of Object.values(moduleMap)) {
      for (const modPath of paths) {
        filesToScan.push(...walk(modPath));
      }
    }
  }

  // Código compartido global (fuera de cualquier módulo): siempre se incluye
  const allModulePaths = Object.values(moduleMap).flat();
  const globalSharedDirs = discoverGlobalSharedDirs(allModulePaths);
  if (globalSharedDirs.length > 1) {
    duplicateWarnings.push(
      `⚠️ Hay ${globalSharedDirs.length} carpetas "shared" globales distintas: ${globalSharedDirs.join(
        " , "
      )} — revisa si deberían unificarse.`
    );
  }
  for (const dir of globalSharedDirs) {
    filesToScan.push(...walk(dir));
  }

  // Archivos de configuración de raíz (solo en escaneo completo, dan contexto global)
  const rootFiles = !requestedModule
    ? CONFIG.rootConfigFiles.filter(exists)
    : [];

  filesToScan = [...new Set(filesToScan)]; // dedupe

  const contract = readOrCreateContract();

  // -------- Construcción del Markdown --------
  let out = `# Escaneo: ${scanLabel}\n\n`;
  out += `_Generado: ${new Date().toISOString()}_\n\n`;

  if (duplicateWarnings.length) {
    out += `## ⚠️ Posibles duplicados detectados\n\n${duplicateWarnings
      .map((w) => `- ${w}`)
      .join("\n")}\n\n`;
    console.log("\n" + duplicateWarnings.join("\n") + "\n");
  }

  out += `## Carpetas "modules" encontradas en el proyecto\n${
    moduleRoots.map((r) => `- ${r}`).join("\n") || "(ninguna)"
  }\n\n`;
  out += `## Módulos detectados\n${
    availableModules
      .map((m) => `- ${m}  (${moduleMap[m].join(" , ")})`)
      .join("\n") || "(ninguno)"
  }\n\n`;
  out += `## Carpetas "shared" globales incluidas\n${
    globalSharedDirs.map((s) => `- ${s}`).join("\n") || "(ninguna)"
  }\n\n`;
  out += `## Contrato de desarrollo\n\n${contract}\n\n`;
  out += `## Árbol de archivos incluidos\n\n${buildTree([
    ...filesToScan,
    ...rootFiles,
  ])}\n\n`;
  out += `## Contenido de archivos\n\n`;

  for (const file of [...rootFiles, ...filesToScan]) {
    const abs = path.join(ROOT, file);
    const content = fs.readFileSync(abs, "utf-8");
    out += `### \`${file}\`\n\n\`\`\`${fenceFor(file)}\n${content}\n\`\`\`\n\n`;
  }

  // -------- Guardar output --------
  const outDir = path.join(ROOT, CONFIG.outputDir);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${scanLabel}-scan.md`);
  fs.writeFileSync(outPath, out, "utf-8");

  const totalChars = out.length;
  console.log(`\n✅ Escaneo completo: ${scanLabel}`);
  console.log(`   Archivos incluidos: ${filesToScan.length + rootFiles.length}`);
  console.log(`   Tamaño aproximado: ${(totalChars / 1000).toFixed(1)}k caracteres (~${Math.round(totalChars / 4)} tokens aprox.)`);
  console.log(`   Guardado en: ${path.relative(ROOT, outPath)}\n`);
}

main();
