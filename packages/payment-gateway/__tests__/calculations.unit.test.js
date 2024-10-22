const { calculateTaxes } = require('../utils/calculations');

describe('calculateTaxes', () => {
  it('should return the correct tax rate for Utah', () => {
    // Arrange
    const state = 'utah';
    const expectedTaxRate = 0.47;

    // Act
    const taxRate = calculateTaxes(state);

    // Assert
    expect(taxRate).toBe(expectedTaxRate);
  });

  it('should return 0 for unknown states', () => {
    // Arrange
    const state = 'unknown';
    const expectedTaxRate = 0;

    // Act
    const taxRate = calculateTaxes(state);

    // Assert
    expect(taxRate).toBe(expectedTaxRate);
  });
});
