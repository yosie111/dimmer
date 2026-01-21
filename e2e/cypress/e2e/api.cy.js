/// <reference types="cypress" />

describe('API Integration Tests', () => {
  const apiUrl = Cypress.env('apiUrl');

  describe('Health Check', () => {
    it('should return healthy status', () => {
      cy.request(`${apiUrl}/api/health`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.message).to.eq('השרת פעיל');
      });
    });
  });

  describe('Products API', () => {
    let createdProductId;

    it('should get all products', () => {
      cy.request(`${apiUrl}/api/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should create a product', () => {
      const product = {
        name: 'E2E Test API Product',
        model: 'mark1',
        positions: 1,
        color: 'white',
        price: 150
      };

      cy.request('POST', `${apiUrl}/api/products`, product).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.eq(true);
        expect(response.body.data.name).to.eq(product.name);
        createdProductId = response.body.data._id;
      });
    });

    it('should get product by id', () => {
      cy.request(`${apiUrl}/api/products/${createdProductId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data._id).to.eq(createdProductId);
      });
    });

    it('should filter products by model', () => {
      cy.request(`${apiUrl}/api/products?model=mark1`).then((response) => {
        expect(response.status).to.eq(200);
        response.body.data.forEach(product => {
          expect(product.model).to.eq('mark1');
        });
      });
    });

    it('should filter products by color', () => {
      cy.request(`${apiUrl}/api/products?color=white`).then((response) => {
        expect(response.status).to.eq(200);
        response.body.data.forEach(product => {
          expect(product.color).to.eq('white');
        });
      });
    });

    it('should update product', () => {
      cy.request('PATCH', `${apiUrl}/api/products/${createdProductId}`, {
        price: 199,
        inStock: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.price).to.eq(199);
        expect(response.body.data.inStock).to.eq(false);
      });
    });

    it('should delete product', () => {
      cy.request('DELETE', `${apiUrl}/api/products/${createdProductId}`).then((response) => {
        expect(response.status).to.eq(200);
      });

      // Verify deleted
      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/products/${createdProductId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should reject invalid product data', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/products`,
        body: { name: 'Only Name' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.success).to.eq(false);
      });
    });

    it('should reject invalid model', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/products`,
        body: {
          name: 'Test',
          model: 'invalid',
          positions: 1,
          color: 'white',
          price: 100
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('Leads API', () => {
    let createdLeadId;
    const timestamp = Date.now();

    it('should create a lead', () => {
      const lead = {
        name: 'E2E Test Lead',
        phone: '050-1234567',
        email: `e2etest${timestamp}@example.com`,
        message: 'Test message'
      };

      cy.request('POST', `${apiUrl}/api/leads`, lead).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.eq(true);
        expect(response.body.data.status).to.eq('new');
        createdLeadId = response.body.data._id;
      });
    });

    it('should get all leads', () => {
      cy.request(`${apiUrl}/api/leads`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should get lead by id', () => {
      cy.request(`${apiUrl}/api/leads/${createdLeadId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data._id).to.eq(createdLeadId);
      });
    });

    it('should filter leads by status', () => {
      cy.request(`${apiUrl}/api/leads?status=new`).then((response) => {
        expect(response.status).to.eq(200);
        response.body.data.forEach(lead => {
          expect(lead.status).to.eq('new');
        });
      });
    });

    it('should update lead status', () => {
      cy.request('PATCH', `${apiUrl}/api/leads/${createdLeadId}`, {
        status: 'contacted'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.status).to.eq('contacted');
      });
    });

    it('should get lead statuses', () => {
      cy.request(`${apiUrl}/api/leads-statuses`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.include('new');
        expect(response.body.data).to.include('contacted');
        expect(response.body.data).to.include('converted');
        expect(response.body.data).to.include('closed');
      });
    });

    it('should delete lead', () => {
      cy.request('DELETE', `${apiUrl}/api/leads/${createdLeadId}`).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should reject invalid email', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/leads`,
        body: {
          name: 'Test',
          phone: '050-1234567',
          email: 'invalid-email'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should reject missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/leads`,
        body: { name: 'Only Name' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('Bulk Operations', () => {
    it('should create multiple products', () => {
      const products = [
        { name: 'E2E Bulk 1', model: 'mark1', positions: 1, color: 'white', price: 100 },
        { name: 'E2E Bulk 2', model: 'mark2', positions: 2, color: 'black', price: 200 }
      ];

      cy.request('POST', `${apiUrl}/api/products/bulk`, { products }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.count).to.eq(2);
      });
    });

    it('should reject bulk with invalid products', () => {
      const products = [
        { name: 'Valid', model: 'mark1', positions: 1, color: 'white', price: 100 },
        { name: 'Invalid', model: 'mark99', positions: 5, color: 'purple', price: 100 }
      ];

      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/products/bulk`,
        body: { products },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
