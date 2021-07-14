describe('', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should initially displayed well', () => {
    cy.get('span[cy="app-title"]').should('contain.text', 'Tainan Public Witnessing');
  });

  it('should toggle menu if menu button clicked', () => {
    cy.get('app-menu').should('not.be.visible');

    cy.get('button[cy="menu-button"]').click();
    cy.get('app-menu').should('be.visible');

    cy.get('button[cy="menu-button"]').click();
    cy.get('app-menu').should('not.be.visible');
  });

  it('should change language if language button clicked', () => {
    cy.get('button[cy="translate-button"]').click();
    cy.get('button[cy="language-button-zh"]').click();
    cy.get('span[cy="app-title"]').should('contain.text', '台南都市公眾見證');
  });
});
