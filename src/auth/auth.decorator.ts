import { SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublicRoute';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AllowRoles = (...roles: Roles[]) =>
  SetMetadata('allowRoles', roles);
export const DenyRoles = (...roles: Roles[]) => SetMetadata('denyRoles', roles);
export const AllRoles = () => SetMetadata('allRoles', true);
