import { fabriek } from '@fabriek/core';

import type { Builder, Middleware } from '@fabriek/core';

type Mock = {
  value: number;
  nested: {
    value: number;
  };
};

const mock: Builder<Mock> = () => ({
  value: 1,
  nested: {
    value: 1,
  },
});

describe('@fabriek/core/fabriek', () => {
  it('should be a function', () => {
    expect(typeof fabriek).toBe('function');
  });

  it('should be a function', () => {
    const factory = fabriek({ mock });
    expect(typeof factory.mock).toBe('function');
  });

  it('should be expected return value', () => {
    const factory = fabriek({ mock });
    expect(factory.mock()).toEqual({ value: 1, nested: { value: 1 } });
  });

  it('should be able specify a default value', () => {
    const factory = fabriek({ mock });
    expect(factory.mock({ value: 2, nested: { value: 2 } })).toEqual({ value: 2, nested: { value: 2 } });
  });

  it('should be able specify a partial default value', () => {
    const factory = fabriek({
      mock: () => ({
        value: 1,
        nested: {
          value: 1,
          mock: 1,
        },
      }),
    });
    expect(factory.mock({ nested: { mock: 2 } })).toEqual({ value: 1, nested: { value: 1, mock: 2 } });
  });

  it('should be return same value each time for static builder', () => {
    const factory = fabriek({ mock });
    expect(factory.mock()).toEqual(factory.mock());
  });

  it('should be return different value each time for dynamic builder', () => {
    const factory = fabriek({ mock: (): Mock => ({ value: Math.random(), nested: { value: Math.random() } }) });
    expect(factory.mock()).not.toEqual(factory.mock());
  });

  it('should be occurs TypeError when specify not a function', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const factory = fabriek({ mock: 1, nested: { value: 1 } });
    expect(() => factory.mock()).toThrowError(TypeError);
  });

  it('should be occurs TypeError when specify not a object', () => {
    const factory = fabriek({ mock });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => factory.mock(1)).toThrowError(TypeError);
  });

  it('should be middlewares invoked in the correct order', () => {
    const fn = jest.fn();

    const middlewares: Middleware[] = [
      (context, next) => {
        fn(1);
        const result = next(context);
        fn(4);
        return result;
      },
      (context, next) => {
        fn(2);
        const result = next(context);
        fn(3);
        return result;
      },
    ];

    fabriek({ mock }, middlewares).mock();
    expect(fn.mock.calls[0]).toEqual([1]);
    expect(fn.mock.calls[1]).toEqual([2]);
    expect(fn.mock.calls[2]).toEqual([3]);
    expect(fn.mock.calls[3]).toEqual([4]);
  });

  it('should be able to rewrite the return value with middleware', () => {
    const fn = jest.fn();

    const middlewares: Middleware[] = [
      (context, next) => {
        const result = next(context);
        fn(result);
        return result;
      },
      (context, next) => {
        const result = next(context);
        fn(result);
        return { value: 2, nested: { value: 2 } };
      },
    ];

    fabriek({ mock }, middlewares).mock();
    expect(fn.mock.calls[0]).toEqual([{ value: 1, nested: { value: 1 } }]);
    expect(fn.mock.calls[1]).toEqual([{ value: 2, nested: { value: 2 } }]);
  });
});
