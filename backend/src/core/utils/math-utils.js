class MathUtils {
  static round(val, dec = 2) {
    const factor = Math.pow(10, dec);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  }
  static percentage(num, den, dec = 2) {
    if (den === 0) return 0;
    return this.round((num / den) * 100, dec);
  }
}

module.exports = { MathUtils };
