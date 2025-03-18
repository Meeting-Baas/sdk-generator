/**
 * Gets all methods from a class instance, including inherited methods
 */
export function getClassMethods(obj: any): string[] {
  const methods = new Set<string>();
  let current = obj;

  while (current && current !== Object.prototype) {
    Object.getOwnPropertyNames(current).forEach((prop) => {
      if (typeof current[prop] === "function" && prop !== "constructor") {
        methods.add(prop);
      }
    });
    current = Object.getPrototypeOf(current);
  }

  return Array.from(methods);
}
