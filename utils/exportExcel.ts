import XLSX from 'xlsx/dist/xlsx.core.min.js';
import { saveAs } from 'file-saver';

/* js-export-excel */


const datenum = function (v, date1904?: boolean) {
  if (date1904) v += 1462;
  let epoch = Date.parse(v);
  const date: any = new Date(Date.UTC(1899, 11, 30));
  return (epoch - date) / (24 * 60 * 60 * 1000);
};

const changeData = function (data, filter) {
  let sj = data,
    f = filter,
    re = [];
  Array.isArray(data)
    ? (function () {
      //对象
      f
        ? (function () {
          //存在过滤
          sj.forEach(function (obj) {
            let one = [];
            filter.forEach(function (no) {
              one.push(obj[no]);
            });
            re.push(one);
          });
        })()
        : (function () {
          //不存在过滤
          sj.forEach(function (obj) {
            let col = Object.keys(obj);
            let one = [];
            col.forEach(function (no) {
              one.push(obj[no]);
            });
            re.push(one);
          });
        })();
    })()
    : (function () {
      re = sj;
    })();
  return re;
};

// 转换数据
const sheetChangeData = function (data) {
  let ws = {};
  let range = {
    s: {
      c: 10000000,
      r: 10000000,
    },
    e: {
      c: 0,
      r: 0,
    },
  };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let cell: any = {
        v: data[R][C],
      };

      if (cell.v == null) continue;

      let cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R,
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else if (/^hyperlink:/.test(cell.v)) {
        cell.l = {
          Target: cell.v.replace(/^hyperlink:/, ''),
        };
        cell.v = cell.v.replace(/^hyperlink:/, '');
      } else cell.t = 's';
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
};

const s2ab = function (s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

const columnwidths = function (columnWidths) {
  const out = columnWidths?.map((item) => {
    return { width: item ? parseInt((256 * (Number(item) / 100)) as any) : 20 };
  });

  return out;
};

const exportExcel = function (options) {
  const _options = {
    fileName: options.fileName || 'download',
    datas: options.datas,
    saveAsBlob: options.saveAsBlob || false,
    workbook: {
      SheetNames: [],
      Sheets: {},
    },
  };

  const instance = {
    saveExcel: function () {
      let wb = _options.workbook;

      _options.datas.forEach(function (data, index) {
        let sheetHeader = data.sheetHeader || null;
        let sheetData = data.sheetData;
        let sheetName = data.sheetName || 'sheet' + (index + 1);
        let sheetFilter = data.sheetFilter || null;
        let columnWidths = data.columnWidths || [];

        sheetData = changeData(sheetData, sheetFilter);

        if (sheetHeader) {
          sheetData.unshift(sheetHeader);
        }

        let ws = sheetChangeData(sheetData);

        ws['!merges'] = [];

        ws['!cols'] = columnwidths(columnWidths);

        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = ws;
      });

      let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
      });
      if (!_options.saveAsBlob) {
        saveAs(
          new Blob([s2ab(wbout)], {
            type: 'application/octet-stream',
          }),
          _options.fileName + '.xlsx'
        );
      } else {
        return new File([s2ab(wbout)], _options.fileName + '.xlsx', {
          type: 'application/octet-stream',
          lastModified: Date.now(),
        });
      }
    },
  };

  return instance;
};

export default exportExcel;

export type TypeExportExcelFunction = typeof exportExcel;