describe("Comparaison d'entreprises", () => {
  it('Should work for valid companies', () => {
    cy.visit('/entreprise/814397527/vs/444786511');
    cy.contains('FRANCOIS BONIFACE');
    cy.contains('GRDF');
  });

  it('Should show error if at least one SIREN is invalid', () => {
    cy.visit('/entreprise/814397527/vs/invalid');
    cy.contains('FRANCOIS BONIFACE');
    cy.contains('INVALIDE');
  });
});
