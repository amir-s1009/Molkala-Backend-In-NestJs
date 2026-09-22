export default class ProductDomain {
  static sortIds(ids: string[]): string[] {
    return ids.sort((a, b) => a.localeCompare(b));
  }
}
