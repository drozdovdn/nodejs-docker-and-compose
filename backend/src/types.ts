import { permissions } from './config/permissions';
import { User } from './users/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: User; // Добавляем поле user в интерфейс Request
  }
}

export type PermissionType = keyof typeof permissions;
