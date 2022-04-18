export type Builder<T extends Record<string, unknown>> = () => T;

export type BuilderOutput<T extends Builder<Record<string, unknown>>> = T extends Builder<infer U> ? U : never;

export type BuilderRecord = Record<string, Builder<Record<string, unknown>>>;

export const build = <T extends Record<string, unknown>>(
  builder: Builder<T>,
  defaults?: Partial<T>,
): T => {
  if (typeof builder !== 'function') {
    throw new TypeError('builder must be a function');
  }
  if (defaults && (typeof defaults !== 'object' || Array.isArray(defaults))) {
    throw new TypeError('defaults must be a object');
  }
  return { ...builder(), ...defaults };
};
