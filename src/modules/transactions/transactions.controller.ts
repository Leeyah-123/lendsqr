import { BaseController } from '../../core/base.controller';
import TransactionsService from './transactions.service';

export default class TransactionsController extends BaseController {
  private transactionsService: TransactionsService;

  constructor() {
    super();

    this.transactionsService = new TransactionsService();
  }
}
