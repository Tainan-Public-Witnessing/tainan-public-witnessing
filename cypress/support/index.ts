import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(uuid: string, password: string): void;
    }
  }
}
