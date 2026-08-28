class DateUtils {
  static nowISO() {
    return new Date().toISOString();
  }
  static addHours(date, hours) {
    const d = new Date(date);
    d.setTime(d.getTime() + hours * 60 * 60 * 1000);
    return d;
  }
  static isPast(date) {
    return new Date(date).getTime() < Date.now();
  }
}

module.exports = { DateUtils };
