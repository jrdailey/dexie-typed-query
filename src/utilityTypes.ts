export type StringKeyOf<T> = Extract<keyof T, string>

export type ExactlyOne<T> = T

export type ExactlyTwo<T> = [T, T]

export type AtLeastTwo<T> = [T, T, ...T[]]

export type ExactlyOneKey<T> = {
  [K in keyof T]: {
    [P in K]: T[P];
  } & {
    [P in Exclude<keyof T, K>]?: never;
  }
}[keyof T]

export type SingleRecord<
  K extends string | number | symbol,
  V,
> = ExactlyOneKey<Record<K, V>>
