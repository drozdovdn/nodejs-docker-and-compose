import { SetMetadata } from '@nestjs/common';

import { PermissionType } from '../../types';

export const permissions = {
  EDIT_WISH: 'EDIT_WISH',
  EDIT_WISHLIST: 'EDIT_WISHLIST',
} as const;

export const PERMISSION_KEY = 'permissions';

export const CheckPermissions = (permission: PermissionType) => SetMetadata(PERMISSION_KEY, permission);
