export default class FinancesService {
  /**
   * @dev This method should be used to verify that the transaction with the provided ID was successful, and was of the expected amount.
   */
  async verifyTransaction(
    _transactionId: string,
    _amount: number
  ): Promise<boolean> {
    // TODO: Implement transaction verification
    return true;
  }

  /**
   * @dev This method should be used to transfer funds from the system to a user.
   */
  async transfer(_acctNumber: number, _amount: number): Promise<void> {
    // TODO: Implement transfer functionality
  }
}
