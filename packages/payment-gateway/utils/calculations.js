function calculateTaxes(state) {
  switch (state) {
    case 'utah':
      return 0.47; // Utah's tax rate is 4.7%
    default:
      return 0;
  }
}

module.exports = { calculateTaxes };
