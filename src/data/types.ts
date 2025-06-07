import { CompoundType, globalTypes, Key, PrimitiveType, Type, Value } from '../data';

export class TypeInfo {
  static DEFAULT_TYPE: TypeInfo = new TypeInfo(globalTypes['default'] as Type, new Map());

  private readonly typeData: Type;
  displayName: string;
  private allTypes: Map<Key, TypeInfo>;
  className: string;

  constructor(typeData: Type, allTypes: Map<Key, TypeInfo>) {
    this.typeData = typeData;
    this.displayName = typeData.displayName;
    this.allTypes = allTypes;
    this.className = typeData.kind == 'primitive'
      ? (typeData as PrimitiveType).style
      : (typeData.kind == "compound"
        ? (allTypes.get((typeData as CompoundType).structure.id) as TypeInfo).className
        : "TBD");
  }

  typeFor(key: Key): TypeInfo {
    if (this.typeData.kind === 'compound') {
      const localData = this.typeData as CompoundType;
      if (key == 'id') {
        return this.allTypes.get(localData.structure.id) || TypeInfo.DEFAULT_TYPE;
      } else {
        return this.allTypes.get(localData.structure[key] as string) || TypeInfo.DEFAULT_TYPE;
      }
    } else {
      return this;
    }
  }

  format(value: Value) {
    return value + '';
  }

  readonly() {
    return this.typeData.kind == 'primitive' && (this.typeData as PrimitiveType).readonly;
  }
}

export function buildTypeMap(typeData: { [key: Key]: Type }) : Map<Key, TypeInfo> {
  const result = new Map();
  Object.entries(typeData).forEach(([key, value]) => {
    result.set(key, new TypeInfo(value, result));
  })
  return result;
}


