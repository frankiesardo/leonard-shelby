import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

/**
 * Writes a file to the garden, creating parent directories as needed.
 * All paths are relative to the project root.
 */
export async function writeGardenFile(
  projectRoot: string,
  relativePath: string,
  content: string
): Promise<void> {
  const fullPath = resolve(projectRoot, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf-8");
  console.log(`  wrote: ${relativePath}`);
}
