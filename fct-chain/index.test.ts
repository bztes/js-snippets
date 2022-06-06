import { call } from '.';

const toInt = (value: string) => Number.parseInt(value);

const toStr = (value: number) => value.toString();

test('test', () => {
  const r = call('123')
    .call(toInt)
    .call(toStr)
    .call(toInt)
    .seek(toStr)
    ?.seek(toInt)
    ?.result(toStr);

  expect(r).toBe('123');
});

