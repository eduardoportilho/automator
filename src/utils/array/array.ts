/**
 * Sort an array according to an ordered list of field values ​​of its items.
 * @param array Original array (will not be mutated).
 * Ex: [{name: 'foo', ...}, {name: 'bar', ...}, {name: 'doe', ...}]
 * @param key Key of the field on the array items used for sorting.
 * Ex: 'name'
 * @param sortedFieldValues List of field values in the desired order.
 * Ex: ['doe', 'foo']
 * @returns Sorted copy of the array.
 * Ex: [{name: 'doe', ...}, {name: 'foo', ...}, {name: 'bar', ...}]
 */
export const sortByFieldIndex = <Type, Key extends keyof Type>({
  array,
  key,
  sortedFieldValues,
}: {
  array: Type[];
  key: Key;
  sortedFieldValues: Type[typeof key][];
}) => {
  return [...array].sort((a, b) => {
    const fieldValueA = a[key];
    const fieldValueB = b[key];

    const indexA = sortedFieldValues.indexOf(fieldValueA);
    const indexB = sortedFieldValues.indexOf(fieldValueB);

    // Neither are in the provided list: equal
    if (indexA < 0 && indexB < 0) {
      // zero if they're equal
      return 0;
    }
    // first is not in the provided list: first is more (move to end)
    if (indexA < 0) {
      // positive value if the second argument is less than the first argument
      return 1;
    }
    // second is not in the provided list: second is more (move to end)
    if (indexB < 0) {
      // negative value if the first argument is less than the second argument
      return -1;
    }

    // compare indexes
    return indexA - indexB;
  });
};
