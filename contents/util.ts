/** 解析搜索数据
 *  @return field path
 */
function findStringInArray(array, target, path = []) {
  const lowerTarget = target.toLowerCase(); // Convert target string to lowercase

  for (let i = 0; i < array.length; i++) {
    const currentPath = [...path, i]; // Append current index to path

    if (typeof array[i] === "string" || typeof array[i] === "number") {
      const lowerString = decodeURIComponent(String(array[i]).toLowerCase()); // Convert string to lowercase
      if (lowerString.indexOf(lowerTarget) !== -1) {
        return currentPath; // Return path if partial match found
      }
    }

    if (Array.isArray(array[i])) {
      const nestedPath = findStringInArray(array[i], target, currentPath);
      if (nestedPath) {
        return nestedPath; // Return path if found in a nested array
      }
    }
  }

  return null; // Return null if no match found
}

// Example usage
/* const data = [
  ["Apple", "Banana", ["Cherry", "Date", "Elderberry"]],
  [["Fig"], "Grape", [["Kiwi"], "Fruit Salad"]],
];

const path = findStringInArray(data, "fruit");
if (path) {
  console.log("String found at path:", path);
} else {
  console.log("String not found");
} */