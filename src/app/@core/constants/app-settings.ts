
export const appSetting = {
  role: {

  },
};

export const CRUD_MODES = {
  EDIT: 'edit',
  CREATE: 'create',
  DETAIL: 'detail',
  DELETE: 'delete',
  SECTION: 'section',
  HEADING: 'heading',
  FK: 'fk',
  FK_MENU: 'fk_menu',
  DEBUG: 'debug',
  PARENT: 'parent',
  CARD: 'card'
} as const;

export type CrudModeType = typeof CRUD_MODES[keyof typeof CRUD_MODES];
