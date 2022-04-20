import { build, Builder } from '@fabriek/core';

type Mock = {
  value: number;
  nested: {
    value: number;
  };
};

describe('@fabriek/core/build', () => {
  it('should be a function', () => {
    expect(typeof build).toBe('function');
  });

  it('should be expected return value', () => {
    const builder: Builder<Mock> = (): Mock => ({ value: 1, nested: { value: 1 } });
    expect(build(builder)).toEqual({ value: 1, nested: { value: 1 } });
  });

  it('should be able specify a default value', () => {
    const builder: Builder<Mock> = (): Mock => ({ value: 1, nested: { value: 1 } });
    expect(build(builder, { value: 2, nested: { value: 2 } })).toEqual({ value: 2, nested: { value: 2 } });
  });

  it('should be able specify a partial default value', () => {
    const builder: Builder<Mock & { nested: { mock: number } }> = (): Mock & { nested: { mock: number } } => ({
      value: 1,
      nested: { value: 1, mock: 1 },
    });
    expect(build(builder, { nested: { mock: 2 } })).toEqual({ value: 1, nested: { value: 1, mock: 2 } });
  });

  it('should be return same value each time for static builder', () => {
    const builder: Builder<Mock> = (): Mock => ({ value: 1, nested: { value: 1 } });
    expect(build(builder)).toEqual(build(builder));
  });

  it('should be return different value each time for dynamic builder', () => {
    const builder: Builder<Mock> = (): Mock => ({ value: Math.random(), nested: { value: Math.random() } });
    expect(build(builder)).not.toEqual(build(builder));
  });

  it('should be occurs TypeError when specify not a function', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => build(1)).toThrowError(TypeError);
  });

  it('should be occurs TypeError when specify not a object', () => {
    const builder: Builder<Mock> = (): Mock => ({ value: 1, nested: { value: 1 } });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => build(builder, 1)).toThrowError(TypeError);
  });
});
