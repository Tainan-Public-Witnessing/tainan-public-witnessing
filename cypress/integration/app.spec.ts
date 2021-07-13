describe('', () => {
  it('should initially displayed well', () => {
    cy.visit('/');
    cy.get('span[cy="app-title"]').should('contain.text', 'Tainan Public Witnessing');
  });
});
