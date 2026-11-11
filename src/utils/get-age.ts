const MONTHS_IN_YEAR = 12;

export type Age = {
  unit: 'years' | 'months';
  count: number;
};

export function getAge(birthDate: Date, today: Date): Age {
  const monthsBeforeBirthday = today.getDate() < birthDate.getDate() ? 1 : 0;
  const months =
    (today.getFullYear() - birthDate.getFullYear()) * MONTHS_IN_YEAR +
    today.getMonth() -
    birthDate.getMonth() -
    monthsBeforeBirthday;
  const elapsedMonths = Math.max(months, 0);

  if (elapsedMonths < MONTHS_IN_YEAR) {
    return { unit: 'months', count: elapsedMonths };
  }

  return { unit: 'years', count: Math.floor(elapsedMonths / MONTHS_IN_YEAR) };
}
