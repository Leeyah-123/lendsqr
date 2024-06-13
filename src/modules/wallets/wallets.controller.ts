import { BaseController } from '../../core/base.controller';
import WalletsService from './wallets.service';

export default class WalletsController extends BaseController {
  private readonly walletsService: WalletsService;

  constructor() {
    super();

    this.walletsService = new WalletsService();
  }
}
