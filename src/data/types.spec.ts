import { describe, expect, it } from 'vitest';
import { buildTypeMap, TypeInfo } from './types';
import { globalTypes, PrimitiveType, TypeMap } from '../data';

function createSimpleType(k: string, props = {}): PrimitiveType {
  return {kind: "primitive",
    displayName: k + " display",
    style: "string-style",
    jsonType: "string",
    ...props};
}

describe('buildTypeMap', () => {

  it('builds an empty map from an empty object', () =>
    {
      const map = buildTypeMap({});
      expect(map).to.be.empty;
    }
  )

  it ('creates keys from the object keys', () =>
    {
      const keys = ['a', 'b', 'c', 'd'];
      const input : TypeMap = {};
      keys.forEach((key) => input[key] = createSimpleType(key));
      const map = buildTypeMap(input);
      expect(map).to.have.keys(keys);
    }
  )

  it ('matches keys with converted types', () =>
  {
    const typeData = [
      ['one', 'First'],
      ['two', 'Second'],
      ['three', 'Third']
    ];
    const input : TypeMap = {};
    typeData.forEach(([key, displayName]) => {
      input[key as string] = createSimpleType(key as string, {displayName: displayName});
    })

    const map = buildTypeMap(input);
    expect(map).to.have.length(typeData.length);
    typeData.forEach(([key, displayName]) => {
      expect(map.get(key as string)).to.be.instanceOf(TypeInfo)
      expect((map.get(key as string) as TypeInfo).displayName).to.equal(displayName);
    })

  })

})

describe('TypeInfo', () => {

  const primitiveType: PrimitiveType = createSimpleType("prim");

  const compoundType = {
    kind: "compound",
    displayName: "Compound Test",
    structure: {
      id: "id",
      name: "default",
      value: "prim"
    },
    key: "id"
  };

  const testTypes = buildTypeMap({ ...globalTypes, prim: primitiveType, comTest: compoundType });

  describe('typeFor', () => {

    it('returns the given type when type is not compound', () => {
      // @ts-ignore
      const prim = testTypes.get('prim') as TypeInfo;
      expect(prim.typeFor("id")).to.deep.equals(prim);
    });

    it('returns the type of the structure key when compound and present', () => {
      const testType = testTypes.get('comTest') as TypeInfo;
      expect(testType.typeFor('value')).to.deep.equals(testTypes.get('prim'));
    });

    it('returns the default type when compound and missing', () => {
      const testType = testTypes.get('comTest') as TypeInfo;
      expect(testType.typeFor('bad')).to.deep.equals(TypeInfo.DEFAULT_TYPE);
    });
  })

  describe('className', () => {

    it('returns the style for primitive types', () => {
      const prim = testTypes.get('prim') as TypeInfo;
      expect(prim.className).to.equal(primitiveType.style);
    });

    it('returns the style for the id for compound types', () => {
      const testType = testTypes.get('comTest') as TypeInfo;
      expect(testType.className).to.equal((testTypes.get('id') as TypeInfo).className);
    })
  })
});