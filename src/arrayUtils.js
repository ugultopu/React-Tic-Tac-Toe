function sumArrays(a1, a2, multiplier) {
  return a1.map((e, i) => e + multiplier * a2[i]);
}

function arrayOfArraysIncludesArray(arrayOfArrays, array) {
  return arrayOfArrays.some(
           subArray => array.every((e, i) => e === subArray[i])
         );
}

export { sumArrays, arrayOfArraysIncludesArray }
