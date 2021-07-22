Cypress.Commands.add('login', (uuid, password) => {
  cy.window().then((w: any) => {
    w.AuthorityService.login(uuid, password);
  });
});
