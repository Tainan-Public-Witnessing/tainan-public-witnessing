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
    cy.get('button[cy="language-buttons"]').contains('Chinese').click();
    cy.get('span[cy="app-title"]').should('contain.text', '台南都市公眾見證');
  });

  it('should login successfully', () => {
    cy.get('button[cy="menu-button"]').click();
    cy.get('mat-list-option[cy="login-button"]').click();
    cy.get('input[cy="username-input"]').type('admin');
    cy.get('mat-option[cy="username-autocomplete-options"]').contains('administrator').click();
    cy.get('input[cy="password-input"]').type('admin');
    cy.get('button[cy="login-submit-button"]').click();
    cy.get('span[cy="welcome-message"]').should('contain.text', 'Hi! administrator');
  });

  it('should display error message if username incorrect while login', () => {
    cy.get('button[cy="menu-button"]').click();
    cy.get('mat-list-option[cy="login-button"]').click();
    cy.get('input[cy="username-input"]').type('wrong username');
    cy.get('input[cy="password-input"]').type('admin');
    cy.get('button[cy="login-submit-button"]').click();
    cy.get('mat-error[cy="username-not-exist-error-message"]').should('contain.text', 'User name do not exist!');
  });

  it('should display error message if password incorrect while login', () => {
    cy.get('button[cy="menu-button"]').click();
    cy.get('mat-list-option[cy="login-button"]').click();
    cy.get('input[cy="username-input"]').type('administrator');
    cy.get('input[cy="password-input"]').type('wrong password');
    cy.get('button[cy="login-submit-button"]').click();
    cy.get('mat-error[cy="wrong-password-error-message"]').should('contain.text', 'Wrong password!');
  });

});
