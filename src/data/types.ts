import { globalTypes, Key, Type } from '../data';

export function buildTypeMap(typeData: { [key: Key]: Type }) : Map<Key, TypeInfo> {
  const result = new Map();
  Object.entries(typeData).forEach(([key, value]) => {
    result.set(key, new TypeInfo(value));
  })
  return result;
}


export class TypeInfo {
  // @ts-ignore
  private typeData: Type;
  displayName: string;
  static DEFAULT_TYPE: TypeInfo = new TypeInfo(globalTypes['default'] as Type);

  constructor(typeData: Type) {
    this.typeData = typeData;
    this.displayName = typeData.displayName;
  }
}