type PathElement = number | null;
type MultiDimensionalArray = any[];

export function fetchDataFromPath(data: MultiDimensionalArray, path: PathElement[], formatArray?: (arr: any[]) => any[]): any[] {
    function traverse(currentData: any, currentIndex: number, currentPath: PathElement[], formatArray): any[] {
      const pathElement = currentPath?.[currentIndex];
      // console.log(`currentData`,currentData, `currentIndex`, currentIndex, `currentPath`, currentPath, 'pathElement', pathElement)
      if (currentIndex === currentPath?.length - 1) {
        let value = currentData?.[pathElement];
        if (Array.isArray(value)) {
          return (formatArray ? formatArray(value) : value?.join(','))
        }
        return value;
      }
      // 当标记为null 而不是number时，遍历这一层级
        if (pathElement === null) {
            if (!Array.isArray(currentData)) {
                throw new Error("Expected an array to iterate over, but got a non-array.");
            }

            return currentData.flatMap((item: any) => traverse(item, currentIndex + 1, currentPath, formatArray));
        } else {
            if (pathElement < 0 || pathElement >= currentData?.length) {
                return null;
            }
            // console.log(`params`, typeof currentData?.[pathElement])
            return traverse(currentData?.[pathElement], currentIndex + 1, currentPath, formatArray);
        }
    }
    return traverse(data, 0, path, formatArray);
}
export function collectData(data: MultiDimensionalArray, paths: {label: string, path: PathElement[], formatArray?}[]): any[] {
  const obj = {}
  const keys = paths.map(item => item.label)
  paths?.forEach(item => {
    obj[item.label] = fetchDataFromPath(data, item.path, item.formatArray)
  })
  const firstKey = Object.keys(obj)[0];
  const firstRow = obj[firstKey];
  const arr = []

  console.log(`keys`, keys, `firstRow`, firstRow, `obj`, obj)

  /* firstRow?.forEach((item, index) => {
    if (item === null) return;
    const row = keys?.reduce((record, key) => {
      record[key] = obj[key][index];
      return record;
    }, {})
    arr.push(row);
  }) */
  keys?.forEach((key) => {
    const values = obj[key];
    // 第一项都是null
    values?.slice(1)?.forEach((value, index) => {
      if (!arr[index]) {
        arr[index] = {}
      }
      arr[index][key] = value;
    })
  })
  // console.log(obj)
  return arr;
}
/* // 使用示例
const exampleArray = [
  [ // 0
    [ // 0,0
      "a", "b"
    ],
    [ // 0,1
      ["c", "d"], // 0,1,0
      ["e", "f"]  // 0,1,1
    ]
  ],
  [ // 1
    ["g", "h"], // 1,0
    ["i", "j"]  // 1,1
  ]
];

const path = [0, 1, null, 1]; // 这里的 null 代表在第三层级遍历所有元素，取每个元素的第二项
console.log(fetchDataFromPath(exampleArray, path)); // 应该输出 ["d", "f"] */
