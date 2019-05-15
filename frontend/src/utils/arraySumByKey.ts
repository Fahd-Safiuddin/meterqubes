export const arraySumByKey = (arr: any[], key: string | number) =>
  arr.map((item: object) => item[key]).reduce((a: number, b: number) => +a + +b)
