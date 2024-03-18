export type Result<T, E> = {Ok: T} | {Err: E};
export type Option<T> = {Some: T} | 'None';

type Variant<T extends object | string> = T extends object ? keyof T : T;
type Value<T extends object | string> = T extends object
  ? T[keyof T]
  : undefined;

function getVariant<T extends object | string>(value: T): Variant<T> {
  if (typeof value === 'object') {
    return Object.keys(value)[0] as Variant<T>;
  } else {
    return value as Variant<T>;
  }
}

function getValue<T extends object | string>(value: T): Value<T> {
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
