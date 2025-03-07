export type TableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  sort?: (a: any, b: any, direction: 'asc' | 'desc') => number;
  direction?: 'asc' | 'desc';
  class?: string;
  rowClass?: string;
  [key: string]: any;
};

export type DataTableResponse<T> = {
  rows: T[];
  total: number;
};
