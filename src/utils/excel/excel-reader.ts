import { read, stream, utils } from "xlsx";
import { Readable } from 'stream';
import { normalizeDate } from '../date-time';

const initialize = () => {
  stream.set_readable(Readable);
};

const readExcelFromFile = (fileData: any) => {
  initialize();
  let data: any[] = [];
  const file = read(fileData, {
    cellDates: true
  });
  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {
      blankrows: false,
      header: 1
    });
    temp.forEach((res) => {
      data.push(res);
    });
  }

  const header = [...data.shift()];
  const dataObjects = data.map((dataEntry) => {
    return dataEntry.reduce((acc: any, d: any, index: number) => {
      return {
        ...acc,
        [header[index]]: d
      };
    });
  });

  dataObjects.forEach((dataEntry) => {
    normalizeDate(dataEntry[header[1]]);
  });

  return { data: dataObjects, header: header };
};

export { readExcelFromFile };
