import { build } from './build';

import type { BuilderDefaults, BuilderOutput, BuilderRecord } from './build';

export type Fabriek<T extends BuilderRecord> = {
  [Key in keyof T]: (defaults?: BuilderDefaults<BuilderOutput<T[Key]>>) => BuilderOutput<T[Key]>;
};

export type MiddlewareContext = {
  key: string;
  defaults?: Record<string, unknown>;
};

export type MiddlewareNext = (context: MiddlewareContext) => Record<string, unknown>;

export type Middleware = (
  context: MiddlewareContext,
  next: MiddlewareNext,
) => Record<string, unknown>;

export const fabriek = <T extends BuilderRecord>(builders: T, middlewares?: Middleware[]): Fabriek<T> => {
  const consumer = (next: MiddlewareNext, index: number = middlewares?.length ?? 0): MiddlewareNext => {
    const middleware = middlewares?.[index - 1];
    if (!middleware) return context => next(context);
    return consumer(context => middleware(context, next), index - 1);
  };

  return Object.entries(builders).reduce<Record<string, unknown>>((previous, [key, value]) => {
    previous[key] = (defaults?: BuilderDefaults<BuilderOutput<typeof value>>) => {
      return consumer(context => build(builders[context.key], context.defaults))({ key, defaults });
    };
    return previous;
  }, {}) as Fabriek<T>;
};
