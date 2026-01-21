/// <reference types="cypress" />

describe('Product Manager - Admin Panel', () => {
  
  beforeEach(() => {
    // וודא שהשרת פעיל
    cy.checkApiHealth().then((response) => {
      expect(response.status).to.eq(200);
    });
    
    // נקה מוצרי טסט קודמים
    cy.cleanupTestProducts();
    
    // כנס לדף הניהול
    cy.visit('/admin');
  });

  describe('Page Load', () => {
    it('should display the admin page', () => {
      cy.contains(/ניהול מוצרים|מוצרים|Products/i).should('be.visible');
    });

    it('should display add product button', () => {
      cy.contains(/הוסף מוצר|הוספת מוצר|Add Product|\+/i).should('be.visible');
    });

    it('should display filter options', () => {
      // בדוק שיש אפשרויות סינון
      cy.get('select').should('have.length.at.least', 1);
    });

    it('should load products from API', () => {
      // בדוק שמוצרים נטענים
      cy.request(`${Cypress.env('apiUrl')}/api/products`).then((response) => {
        if (response.body.data.length > 0) {
          // אם יש מוצרים, הם צריכים להופיע
          cy.get('[class*="card"], [class*="product"], [class*="item"]').should('exist');
        }
      });
    });
  });

  describe('Add Product', () => {
    it('should open add product modal', () => {
      cy.contains(/הוסף מוצר|הוספת מוצר|\+/i).click();
      
      // בדוק שהמודל נפתח
      cy.get('[class*="modal"], [role="dialog"], form').should('be.visible');
    });

    it('should create a new product successfully', () => {
      const timestamp = Date.now();
      const productName = `E2E Test Product ${timestamp}`;
      
      // פתח מודל הוספה
      cy.contains(/הוסף מוצר|הוספת מוצר|\+/i).click();
      
      // מלא את הטופס
      cy.get('input[name="name"], input[placeholder*="שם"]').clear().type(productName);
      
      // בחר דגם
      cy.get('select').contains(/mark|דגם/i).parents('select').select('mark1');
      
      // בחר מעגלים
      cy.get('select').then($selects => {
        $selects.each((i, el) => {
          const $el = Cypress.$(el);
          if ($el.find('option[value="1"]').length && !$el.find('option[value="mark1"]').length) {
            cy.wrap(el).select('1');
          }
        });
      });
      
      // בחר צבע
      cy.get('select').then($selects => {
        $selects.each((i, el) => {
          const $el = Cypress.$(el);
          if ($el.find('option[value="white"]').length) {
            cy.wrap(el).select('white');
          }
        });
      });
      
      // הזן מחיר
      cy.get('input[name="price"], input[type="number"]').clear().type('199');
      
      // שלח
      cy.get('button[type="submit"], button').contains(/הוסף|שמור|צור|Add|Save|Create/i).click();
      
      // בדוק שהמוצר נוסף
      cy.contains(productName, { timeout: 10000 }).should('be.visible');
      
      // וודא ב-API
      cy.request(`${Cypress.env('apiUrl')}/api/products`).then((response) => {
        const product = response.body.data.find(p => p.name === productName);
        expect(product).to.exist;
        expect(product.price).to.eq(199);
      });
    });

    it('should show validation error for missing fields', () => {
      cy.contains(/הוסף מוצר|הוספת מוצר|\+/i).click();
      
      // נסה לשלוח בלי למלא
      cy.get('button[type="submit"], button').contains(/הוסף|שמור|Add|Save/i).click();
      
      // בדוק שיש שגיאה או שהטופס לא נשלח
      cy.get('input:invalid, [class*="error"], [class*="invalid"]').should('exist');
    });
  });

  describe('Edit Product', () => {
    let testProductId;
    
    beforeEach(() => {
      // צור מוצר לבדיקה
      const timestamp = Date.now();
      cy.createProductViaApi({
        name: `E2E Test Edit ${timestamp}`,
        model: 'mark1',
        positions: 1,
        color: 'white',
        price: 100,
        inStock: true
      }).then((response) => {
        testProductId = response.body.data._id;
        cy.visit('/admin');
      });
    });

    it('should open edit modal when clicking edit button', () => {
      cy.contains('E2E Test Edit').parents('[class*="card"], [class*="product"], div').within(() => {
        cy.contains(/ערוך|Edit/i).click();
      });
      
      // בדוק שהמודל נפתח
      cy.get('[class*="modal"], [role="dialog"]').should('be.visible');
    });

    it('should update product price', () => {
      cy.contains('E2E Test Edit').parents('[class*="card"], [class*="product"], div').within(() => {
        cy.contains(/ערוך|Edit/i).click();
      });
      
      // עדכן מחיר
      cy.get('input[name="price"], input[type="number"]').clear().type('299');
      
      // שמור
      cy.get('button[type="submit"], button').contains(/עדכן|שמור|Update|Save/i).click();
      
      // בדוק שהמחיר עודכן
      cy.contains('299').should('be.visible');
      
      // וודא ב-API
      cy.request(`${Cypress.env('apiUrl')}/api/products/${testProductId}`).then((response) => {
        expect(response.body.data.price).to.eq(299);
      });
    });

    it('should update product stock status', () => {
      cy.contains('E2E Test Edit').parents('[class*="card"], [class*="product"], div').within(() => {
        cy.contains(/ערוך|Edit/i).click();
      });
      
      // שנה סטטוס מלאי
      cy.get('input[type="checkbox"]').click();
      
      // שמור
      cy.get('button[type="submit"], button').contains(/עדכן|שמור|Update|Save/i).click();
      
      // בדוק שהסטטוס השתנה
      cy.wait(1000);
      cy.request(`${Cypress.env('apiUrl')}/api/products/${testProductId}`).then((response) => {
        expect(response.body.data.inStock).to.eq(false);
      });
    });
  });

  describe('Delete Product', () => {
    let testProductId;
    
    beforeEach(() => {
      const timestamp = Date.now();
      cy.createProductViaApi({
        name: `E2E Test Delete ${timestamp}`,
        model: 'mark2',
        positions: 2,
        color: 'black',
        price: 200,
        inStock: true
      }).then((response) => {
        testProductId = response.body.data._id;
        cy.visit('/admin');
      });
    });

    it('should delete product when confirmed', () => {
      cy.contains('E2E Test Delete').should('be.visible');
      
      cy.contains('E2E Test Delete').parents('[class*="card"], [class*="product"], div').within(() => {
        cy.contains(/מחק|Delete/i).click();
      });
      
      // אשר מחיקה (אם יש confirm)
      cy.on('window:confirm', () => true);
      
      // בדוק שהמוצר נעלם
      cy.contains('E2E Test Delete').should('not.exist');
      
      // וודא ב-API
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/api/products/${testProductId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Filter Products', () => {
    beforeEach(() => {
      // צור מוצרים לבדיקת סינון
      cy.createProductViaApi({
        name: 'E2E Test Filter Mark1',
        model: 'mark1',
        positions: 1,
        color: 'white',
        price: 100,
        inStock: true
      });
      
      cy.createProductViaApi({
        name: 'E2E Test Filter Mark2',
        model: 'mark2',
        positions: 2,
        color: 'black',
        price: 200,
        inStock: false
      });
      
      cy.visit('/admin');
    });

    it('should filter products by model', () => {
      // בחר mark1
      cy.get('select').first().select('mark1');
      
      cy.wait(500);
      
      // בדוק שרק mark1 מוצג
      cy.contains('E2E Test Filter Mark1').should('be.visible');
      cy.contains('E2E Test Filter Mark2').should('not.exist');
    });

    it('should filter products by color', () => {
      // מצא select של צבע ובחר
      cy.get('select').then($selects => {
        $selects.each((i, el) => {
          const $el = Cypress.$(el);
          if ($el.find('option[value="black"]').length) {
            cy.wrap(el).select('black');
          }
        });
      });
      
      cy.wait(500);
      
      // בדוק התוצאות
      cy.contains('E2E Test Filter Mark2').should('be.visible');
    });

    it('should filter products by stock status', () => {
      // מצא select של מלאי
      cy.get('select').then($selects => {
        $selects.each((i, el) => {
          const $el = Cypress.$(el);
          if ($el.find('option[value="true"]').length && $el.find('option[value="false"]').length) {
            cy.wrap(el).select('true');
          }
        });
      });
      
      cy.wait(500);
      
      // בדוק שרק מוצרים במלאי מוצגים
      cy.contains('E2E Test Filter Mark1').should('be.visible');
    });

    it('should clear filters and show all products', () => {
      // בחר פילטר
      cy.get('select').first().select('mark1');
      cy.wait(500);
      
      // נקה פילטר
      cy.get('select').first().select('');
      cy.wait(500);
      
      // בדוק שכל המוצרים מוצגים
      cy.contains('E2E Test Filter Mark1').should('be.visible');
      cy.contains('E2E Test Filter Mark2').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/admin');
      
      cy.contains(/ניהול מוצרים|מוצרים/i).should('be.visible');
      cy.contains(/הוסף מוצר|\+/i).should('be.visible');
    });

    it('should work on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/admin');
      
      cy.contains(/ניהול מוצרים|מוצרים/i).should('be.visible');
    });
  });
});
