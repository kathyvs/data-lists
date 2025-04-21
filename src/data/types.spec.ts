import { describe, expect, it } from 'vitest';
import { buildTypeMap, TypeInfo } from './types';
import { Type, TypeMap } from '../data';

function createSimpleType(k: string, props = {}): Type {
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