export function findServiceCategoryName(categories, categoryId, language = 'en') {
  if (!categoryId) return '';
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return '';
  return category.name?.[language] || category.name?.en || '';
}
