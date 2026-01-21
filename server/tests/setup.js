const dotenv = require('dotenv');
dotenv.config();

// הגדרת timeout ארוך יותר לטסטים
jest.setTimeout(30000);

// השתקת לוגים בזמן טסטים
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});
