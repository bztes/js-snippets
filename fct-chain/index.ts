export function seek<V>(value: V) {
  return value === undefined || value === null ? undefined : call(value);
}

export function call<V>(value: V) {
  return {
    call: <R>(fct: (value: V) => R) => _call(fct, value),
    result: <R>(fct: (value: V) => R) => fct(value),
    seek: <R>(fct: (value: V) => R) => _seek(fct, value),
  };
}

function _seek<V, R>(fct: (value: V) => R, value: V) {
  const result: R = fct(value);

  return result === undefined || result === null
    ? undefined
    : _call(fct, value);
}

function _call<V, R>(fct: (value: V) => R, value: V) {
  const result: R = fct(value);

  return {
    call: <NR>(fct: (value: R) => NR) => _call(fct, result),
    result: <NR>(fct: (value: R) => NR) => fct(result),
    seek: <NR>(fct: (value: R) => NR) => _seek(fct, result),
  };
}
