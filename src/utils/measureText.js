export async function loadMeasureText(measureId) {
  const { default: datapack } = await import('../../data/datapack.json');
  const sourceMeasure = datapack.measures.find((item) => item.id === measureId);

  if (!sourceMeasure?.fullText) {
    throw new Error(`The legal text for ${measureId} could not be found.`);
  }

  return sourceMeasure.fullText;
}
