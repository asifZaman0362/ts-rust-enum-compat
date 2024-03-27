export type Result<T, E> = {Ok: T} | {Err: E};
export type Option<T> = {Some: T} | 'None';

export type Variant<T extends object | string> = T extends object ? keyof T : T;
export type Value<T extends object | string> = T extends object
  ? T[keyof T]
  : undefined;

export function getVariant<T extends object | string>(value: T): Variant<T> {
  if (typeof value === 'object') {
    return Object.keys(value)[0] as Variant<T>;
  } else {
    return value as Variant<T>;
  }
}

export function getValue<T extends object | string>(value: T): Value<T> {
  if (typeof value === 'object') {
    return Object.values(value)[0] as Value<T>;
  } else {
    return undefined as Value<T>;
  }
}

export function isSome<T>(option: Option<T>): option is {Some: T} {
  return getVariant(option) === 'Some';
}

export function isNone<T>(option: Option<T>): option is 'None' {
  return getVariant(option) === 'None';
}

export function isOk(result: Result<any, any>): result is {Ok: any} {
  return getVariant(result) === 'Ok';
}

export function isErr(result: Result<any, any>): result is {Err: any} {
  return getVariant(result) === 'Err';
}

export function unwrap<T>(option: Option<T>): T {
  if (isSome(option)) {
    return option.Some;
  } else {
    throw 'called unwrap on None';
  }
}

export function unwrapOr<T>(option: Option<T>, defaultValue: T): T {
  if (isSome(option)) {
    return option.Some;
  } else {
    return defaultValue;
  }
}

export function unwrapErr(result: Result<any, any>): any {
  if (isErr(result)) {
    return result.Err;
  } else {
    throw 'called unwrapErr on Ok';
  }
}

export function unwrapOk<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return getValue(result);
  } else {
    throw 'called unwrapOk on Err';
  }
}

export function unwrapOrElse<T, E>(result: Result<T, E>, defaultValue: T): any {
  if (isOk(result)) {
    return getValue(result);
  } else {
    return defaultValue;
  }
}

export function matchResult<T, E, R>(
  result: Result<T, E>,
  ok: (value: T) => R,
  err: (e: E) => R,
): R {
  if (isOk(result)) {
    return ok(unwrapOk(result));
  } else {
    return err(unwrapErr(result));
  }
}

export function isVariant<T extends object | string, V extends T>(
  e: T,
  v: Variant<T>,
): e is V {
  return getVariant(e) === v;
}

export function match<T extends object | string, R>(
  e: T,
  a: EnumCallbackPair<T, R>[],
  nomatch: () => R,
): R {
  for (let f of a) {
    if (getVariant(e) == f[0]) {
      return f[1](getValue(e));
    }
  }
  return nomatch();
}

export function matchOption<T, R>(
  option: Option<T>,
  some: (value: T) => R,
  none: () => R,
): R {
  if (isSome(option)) {
    return some(unwrap(option));
  } else {
    return none();
  }
}

export function Ok<T>(value: T): {Ok: T} {
  return {Ok: value};
}

export function Err<E>(err: E): {Err: E} {
  return {Err: err};
}

export function Some<T>(value: T): {Some: T} {
  return {Some: value};
}

export type None = 'None';

export type EnumCallbackPair<T extends object | string, R> = T extends object
  ? {[K in keyof T]: [kind: K, cb: (value: T[K]) => R]}[keyof T]
  : [kind: T, cb: (value: any) => R];

export type CallbackMap<T extends object | string, R> = T extends object
  ? Map<{[K in keyof T]: K}[keyof T], (value: T[keyof T]) => R>
  : Map<T, () => R>;

export type EnumCallback<T extends object | string, R> = T extends object
  ? {[K in keyof T]: (value: T[K]) => R}[keyof T]
  : (value: any) => R;
