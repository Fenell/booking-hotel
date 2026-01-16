export type DyanmicDataPagingRequest = {
  tableNames: string;
  ids?: string;
  searchTerm?: string;
  fields?: string;
  pageNumber: number;
  pageSize: number;
  searchFields?: string;
  filters?: Filter[];
  sorts?: Sort[];
};

export type DynamicDataPagingResponse<T extends readonly unknown[]> = {
  data: T;
  tota: bigint;
  pageSize: number;
  pageNumber: number;
};

type Filter = {
  field: string;
  operator: string;
  value: string;
};

type Sort = {
  name: string;
  direction: string;
};

export type DeleteDataRequest = {
  tableName: string;
  primaryKey: string;
  deleteType: string;
};

// "tableNames": "",
//   "ids": "",
//   "searchTerm": "",
//   "fields": "",
//   "filters": [
//     {
//       "field": "",
//       "operator": "",
//       "value": ""
//     }
//   ],
//   "sorts": [
//     {
//       "name": "",
//       "direction": ""
//     }
//   ],
//   "pageNumber": 1,
//   "pageSize": 1,
//   "searchFields": ""
