import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY, permissions } from '../../config/permissions';
import { WishesService } from '../../wishes/wishes.service';
import { WishlistsService } from '../../wishlists/wishlists.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private wishService: WishesService,
    private wishlistsService: WishlistsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredPermission = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
    if (!requiredPermission) {
      // Если метаданные не заданы, доступ разрешен
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { user, params, body } = request;
    const resourceId = params.id;
    switch (requiredPermission) {
      case permissions.EDIT_WISH:
        const wish = await this.wishService.findOne(resourceId);
        if (wish.owner.id !== user.id) {
          throw new UnauthorizedException('Вы не можете редактировать этот подарок');
        }
        if (wish.offers.length && body.price && wish.price !== body.price) {
          throw new UnauthorizedException('Нельзя отредактировать стоимость, когда уже кто то скинулся');
        }
        return true;
      case permissions.EDIT_WISHLIST:
        const wishlist = await this.wishlistsService.findOne(resourceId);
        if (wishlist.owner.id !== user.id) {
          throw new UnauthorizedException('Вы не можете редактировать этот вишлист');
        }
        return true;
      default:
        return true;
    }
  }
}
