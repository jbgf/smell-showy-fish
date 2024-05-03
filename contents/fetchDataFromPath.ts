type PathElement = number | null;
type MultiDimensionalArray = any[];

export function fetchDataFromPath(data: MultiDimensionalArray, path: PathElement[]): any[] {
    function traverse(currentData: any, currentIndex: number, currentPath: PathElement[]): any[] {
      const pathElement = currentPath?.[currentIndex];
      // console.log(`currentData`,currentData, `currentIndex`, currentIndex, `currentPath`, currentPath, 'pathElement', pathElement)
      if (currentIndex === currentPath?.length - 1) {
        return currentData?.[pathElement];
      }
      // 当标记为null 而不是number时，遍历这一层级
        if (pathElement === null) {
            if (!Array.isArray(currentData)) {
                throw new Error("Expected an array to iterate over, but got a non-array.");
            }
            return currentData.flatMap((item: any) => traverse(item, currentIndex + 1, currentPath));
        } else {
            if (pathElement < 0 || pathElement >= currentData?.length) {
                return null;
            }
            // console.log(`params`, typeof currentData?.[pathElement])
            return traverse(currentData?.[pathElement], currentIndex + 1, currentPath);
        }
    }
    return traverse(data, 0, path);
}
export function collectData(data: MultiDimensionalArray, path1: PathElement[], path2: PathElement[]): any[] {
  const data1 = fetchDataFromPath(data, path1);
  // const data2 = fetchDataFromPath(data, path2);
  return data1.map((item, index) => ({
    Feature: item,
      // phone: data2[index] || null // 使用 data2 的相应项或者 null 如果索引不存在
  }));
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
