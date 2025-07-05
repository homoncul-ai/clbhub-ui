
export const appSetting = {
  role: {

  },
};

export const CRUD_MODES = {
  EDIT: 'edit',
  CREATE: 'create',
  VIEW: 'view',
  DETAIL: 'detail',
  DELETE: 'delete',
  SECTION: 'section',
  HEADING: 'heading',
  FK: 'fk'
} as const;

export type CrudModeType = typeof CRUD_MODES[keyof typeof CRUD_MODES];
