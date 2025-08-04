// Adapted from https://github.com/panva/node-oidc-provider/blob/main/example/support/account.js

import { addUserInfoPromise } from "./verifyJWT.js";
import { ACCOUNT_MAP, ACCOUNTS, ACCOUNT_AUTO_ADD } from "../config/accounts.js";
import { strict as assert } from 'assert';


class Account {
  /**
   * @param profile {AccountLocalData}
   */
  constructor(profile) {
    this.profile = profile;
    this.accountId = profile.sub;
  }

  // noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
  /**
   * @param use {"id_token" | "userinfo"} - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope {string[]} - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   * @return {Promise<AccountLocalData>}
   */
  async claims(use, scope) {
    return this.profile;
  }
}

class AccountService {
  /**
   *
   * @param req {AuthorizedRequest}
   * @param expectedMail {string}
   * @return {Promise<Account>}
   */
  static findByLogin(req, expectedMail) {
    return new Promise((resolve) => {
      console.debug(`find account login=${expectedMail}`);
      AccountService.assertVerifiedUser(req, expectedMail);

      for (const accountId of Object.keys(ACCOUNT_MAP)) {
        const accountEmails = ACCOUNT_MAP[accountId];
        if (!accountEmails.includes(expectedMail)) {
          continue;
        }

        resolve(AccountService.getAccountById(accountId));
      }
      if(ACCOUNT_AUTO_ADD) {
        console.warn(`Account with email ${expectedMail} not found, but auto-adding...`);
        return resolve(AccountService.addNewAccount(expectedMail));
      }

      throw new Error(`Local account ${expectedMail} not found`);
    });
  }

  /**
   * Locates account from OIDC provider by pre-verified email
   * @param ctx {{req: AuthorizedRequest}}
   * @param accountId {string}
   * @return {Promise<Account>}
   */
  static async findAccount(ctx, accountId) {
    console.debug(`find account id=${accountId}`);

    await addUserInfoPromise(ctx.req);
    const account = AccountService.getAccountById(accountId);

    AccountService.assertVerifiedUser(ctx.req, ctx?.req?.user?.email);
    return account;
  }

  /**
   * @param accountId {string}
   * @return {Account}
   */
  static getAccountById(accountId) {
    const accountData = ACCOUNTS.find(account => account.sub === accountId);
    if(!accountData && ACCOUNT_AUTO_ADD) {
      console.warn(`Account with ID ${accountId} not found, but auto-adding...`);
      return AccountService.addNewAccount(accountId);
    }
    console.debug(`looking for ${accountId} (found: ${!!accountData})`);
    assert(accountData);
    return new Account(accountData);
  }

  /**
   * Asserts email address from Express request and compares to the expected value
   * @param req {AuthorizedRequest}
   * @param expected {string} expected email address
   * @return {void}
   */
  static assertVerifiedUser(req, expected) {
    if (req.path === "/token" || req.path === "/me") {
      // already verified by the provider
      return;
    }

    if (!req?.user?.email || !expected || expected !== req.user.email) {
      throw new Error(`Username "${expected}" does not match expected email ${req.user.email}`);
    }
  }

  /**
   * Adds a new account to ACCOUNTS and ACCOUNT_MAP, used when ACCOUNT_AUTO_ADD is set to true
   * @param accountId {string}
   * @return {Account}
   */
  static addNewAccount(accountId) {
    const newAccount = {
      sub: accountId,
      email: accountId,
      email_verified: true,
      name: accountId.split('@')[0],
      locale: 'en-US',
    };
    ACCOUNTS.push(newAccount);
    ACCOUNT_MAP[accountId] = [newAccount.email];
    return new Account(newAccount);
  }
}

export default AccountService;
