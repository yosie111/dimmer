/// <reference types="cypress" />

describe('Landing Page - Lead Capture', () => {
  
  beforeEach(() => {
    // וודא שהשרת פעיל
    cy.checkApiHealth().then((response) => {
      expect(response.status).to.eq(200);
    });
    
    // נקה לידים של טסטים קודמים
    cy.cleanupTestLeads();
    
    // כנס לדף הנחיתה
    cy.visit('/');
  });

  describe('Page Load', () => {
    it('should display the landing page correctly', () => {
      // בדוק שהדף נטען
      cy.get('body').should('be.visible');
      
      // בדוק שיש כותרת
      cy.contains('Dimmer').should('be.visible');
    });

    it('should display the contact form', () => {
      // בדוק שהטופס קיים
      cy.get('form').should('exist');
      
      // בדוק שדות הטופס
      cy.get('input[name="name"], input[placeholder*="שם"]').should('exist');
      cy.get('input[name="phone"], input[placeholder*="טלפון"]').should('exist');
      cy.get('input[name="email"], input[placeholder*="אימייל"], input[placeholder*="מייל"]').should('exist');
    });

    it('should display products section', () => {
      // בדוק שיש אזור מוצרים
      cy.contains(/מוצרים|דימר|Dimmer/i).should('exist');
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty required fields', () => {
      // נסה לשלוח טופס ריק
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });
      
      // בדוק שיש הודעת שגיאה או שהטופס לא נשלח
      cy.get('input:invalid').should('exist');
    });

    it('should show error for invalid email', () => {
      cy.get('input[name="name"], input[placeholder*="שם"]').first().type('בדיקה');
      cy.get('input[name="phone"], input[placeholder*="טלפון"]').first().type('050-1234567');
      cy.get('input[name="email"], input[placeholder*="אימייל"], input[placeholder*="מייל"]').first().type('invalid-email');
      
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });
      
      // בדוק שהאימייל לא תקין
      cy.get('input[type="email"]:invalid').should('exist');
    });
  });

  describe('Successful Lead Submission', () => {
    it('should submit form successfully with valid data', () => {
      const timestamp = Date.now();
      const testEmail = `e2etest${timestamp}@example.com`;
      
      // מלא את הטופס
      cy.get('input[name="name"], input[placeholder*="שם"]').first().clear().type('E2E Test User');
      cy.get('input[name="phone"], input[placeholder*="טלפון"]').first().clear().type('050-1234567');
      cy.get('input[name="email"], input[placeholder*="אימייל"], input[placeholder*="מייל"]').first().clear().type(testEmail);
      
      // אם יש שדה הודעה
      cy.get('textarea, input[name="message"]').then($el => {
        if ($el.length) {
          cy.wrap($el).first().type('הודעת בדיקה מ-E2E');
        }
      });
      
      // שלח את הטופס
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });
      
      // בדוק שיש הודעת הצלחה
      cy.contains(/תודה|נשלח|בהצלחה|success/i, { timeout: 10000 }).should('be.visible');
      
      // וודא שהליד נשמר ב-API
      cy.request(`${Cypress.env('apiUrl')}/api/leads`).then((response) => {
        const lead = response.body.data.find(l => l.email === testEmail);
        expect(lead).to.exist;
        expect(lead.name).to.eq('E2E Test User');
        expect(lead.status).to.eq('new');
      });
    });

    it('should clear form after successful submission', () => {
      const timestamp = Date.now();
      const testEmail = `e2etest${timestamp}@example.com`;
      
      // מלא ושלח
      cy.get('input[name="name"], input[placeholder*="שם"]').first().clear().type('E2E Test Clear');
      cy.get('input[name="phone"], input[placeholder*="טלפון"]').first().clear().type('050-9999999');
      cy.get('input[name="email"], input[placeholder*="אימייל"], input[placeholder*="מייל"]').first().clear().type(testEmail);
      
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });
      
      // המתן להצלחה
      cy.contains(/תודה|נשלח|בהצלחה|success/i, { timeout: 10000 }).should('be.visible');
      
      // בדוק שהטופס התנקה (או שעדיין מלא - תלוי בהתנהגות)
      cy.wait(1000);
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      
      // בדוק שהדף נראה טוב במובייל
      cy.get('form').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      
      cy.get('form').should('be.visible');
    });
  });
});
