
/**
 * Dynamically imports a module, falling back to .example.js if the main file is not found.
 * @param {string} modulePath - Path to the .js file (should end with .js)
 * @returns {Promise<any>} The imported module
 */
export async function dynamicImport(modulePath) {
  try {
    return await import(modulePath);
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND' || e.code === 'MODULE_NOT_FOUND') {
      const fallbackPath = modulePath.replace(/\.js$/, '.example.js');
      return await import(fallbackPath);
    }
    throw e;
  }
}
