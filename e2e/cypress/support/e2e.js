// ***********************************************************
// Custom commands and global configuration for Cypress
// ***********************************************************

// פקודה ליצירת ליד דרך API (לצורך setup)
Cypress.Commands.add('createLeadViaApi', (leadData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/leads`,
    body: leadData
  });
});

// פקודה ליצירת מוצר דרך API (לצורך setup)
Cypress.Commands.add('createProductViaApi', (productData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/products`,
    body: productData
  });
});

// פקודה למחיקת מוצרי טסט
Cypress.Commands.add('cleanupTestProducts', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/products`
  }).then((response) => {
    const testProducts = response.body.data.filter(p => p.name.includes('E2E Test'));
    testProducts.forEach(product => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/api/products/${product._id}`
      });
    });
  });
});

// פקודה למחיקת לידים של טסט
Cypress.Commands.add('cleanupTestLeads', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/leads`
  }).then((response) => {
    const testLeads = response.body.data.filter(l => l.email.includes('e2etest'));
    testLeads.forEach(lead => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/api/leads/${lead._id}`
      });
    });
  });
});

// פקודה לבדיקת תקינות השרת
Cypress.Commands.add('checkApiHealth', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/health`,
    failOnStatusCode: false
  });
});
