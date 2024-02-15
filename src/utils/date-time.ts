import { PeriodSemesterType } from "@/app/binus-enrichment/page";

export interface Month {
    text: string,
    period: PeriodSemesterType[],
}
const months: Month[] = [
  {
    text: 'January',
    period: ['odd'],
  },
  {
    text: 'February',
    period: ['odd', 'even'],
  },
  {
    text: 'March',
    period: ['even'],
  },
  {
    text: 'April',
    period: ['even'],
  },
  {
    text: 'May',
    period: ['even'],
  },
  {
    text: 'June',
    period: ['even'],
  },
  {
    text: 'July',
    period: ['even'],
  },
  {
    text: 'August',
    period: ['even'],
  },
  {
    text: 'September',
    period: ['odd'],
  },
  {
    text: 'October',
    period: ['odd'],
  },
  {
    text: 'November',
    period: ['odd'],
  },
  {
    text: 'December',
    period: ['odd'],
  }
];

const normalizeDate = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0);
};

const getFormattedDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const monthString = months[month].text;
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  const dateString = `${day} ${monthString.substring(0, 3)} ${year}`;

  return { date: dateString, time: timeString };
};

export { months, normalizeDate, getFormattedDate };
