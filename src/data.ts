
type KeyMap<T> = {
  [key: Key]: T;
}

type Key = string;
type TypeKey = Key;
type FieldKey = Key;
type TableKey = Key;

type JsonType = "string" | "number" | "boolean";
type Value = string | number | boolean ;

interface TypeBase {
   kind: Key;
   displayName: string;
}

interface PrimitiveType extends TypeBase {
  style: Key;
  jsonType: JsonType;
}

interface CompoundType extends TypeBase {
  key: FieldKey,
  dataTable: TableKey,
  structure: KeyMap<TypeKey>
}

interface ReferenceType extends TypeBase {

}

type Type = CompoundType | PrimitiveType | ReferenceType;

export interface Table {
  type: TypeKey;
  columns: Column[];
  data: KeyMap<Value>[];
}

interface Column {
  data: FieldKey;
  header: string;
}

export type TypeMap = KeyMap<Type>;
export type TableMap = KeyMap<Table>;

export type Data = {
  displayName: string;
  types: TypeMap;
  dataTables: TableMap;
}

export const globalTypes: TypeMap = {
  id: {
    kind: "primitive",
    displayName: "ID",
    style: "id-style",
    jsonType: "string"
  },
  int: {
    kind: "primitive",
    displayName: "Integer",
    jsonType: "number",
    style: "number-style"
  },
  default: {
    kind: "primitive",
    displayName: "Auto",
    jsonType: "string",
    style: "string-style"
  }
}

const data: Data = {
  displayName: "Spanish Given Names from Diez Melcon",
  types: {
    entry: {
      kind: "compound",
      displayName: "Name Instances",
      structure: {
        id: "id",
        name: "default",
        standardName: "[names]",
        source: "int",
        entry: "default",
        year: "int",
        gender: "default"
      },
      key: "id"
    },
    name: {
      kind: "compound",
      displayName: "Names",
      structure: {
        id: "id",
        standardName: "default",
        description: "default"
      },
      key: "id"
    }
  },
  dataTables: {
    entries: {
      type: "entry",
      columns: [
        {
          data: "id",
          header: ""
        },
        { data: "name", header: "Name Instance" },
        { data: "source", header: "Source"},
        { data: "entry", header: "Surname"},
        {
          data: "year",
          header: "Year Found"
        },
        {
          data: "gender",
          header: "Indicated Gender"
        },
        { data: "nameRef", "header": "Standard Name"}
      ],
      data: [
        {
          id: "001",
          name: "Vigilia",
          source: 226,
          entry: "Abbas",
          year: 850,
          gender: "",
          nameRef: "003"
        },
        {
          id: "002",
          name: "Martinus",
          source: 226,
          entry: "Abbas",
          year: 950,
          gender: "male",
          nameRef: "002"
        },
        {
          id: "003",
          name: "Pedro",
          source: 226,
          entry: "Abad",
          year: 1200,
          gender: "",
          nameRef: "001"
        }
      ]
    },
    names: {
      type: "name",
      columns: [{
        data: "id",
        header: ""
      },
        { data: "standardName", header: "Name" },
        { data: "exampleName", header: "Attested Name"},
        { data: "gender", header: "Gender(s)"}
      ],
      data: [
        {
          id: "001",
          standardName: "Pedro",
          description: ""
        },
        {
          id: "002",
          standardName: "Martín",
          description: ""
        },
        {
          id: "003",
          standardName: "Vigilia",
          description: ""
        }
      ]
    }
  }
}
export function loadData(): Data {
  return data;
}

