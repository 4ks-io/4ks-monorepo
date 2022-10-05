import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
  format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export function formatDate(dateTime: string) {
  // const time = '2019-10-25T08:10:00Z';

  const parsedTime = parseISO(dateTime);
  // console.log(parsedTime); // 2019-10-25T08:10:00.000Z

  const formattedTime = formatInTimeZone(parsedTime, 'yy/MM/dd', 'UTC');
  // console.log(formattedTime); // 2019-10-25 08:10:00 +00:00
  return formattedTime;
}

export function formatDateTime(dateTime: string) {
  // const time = '2019-10-25T08:10:00Z';

  const parsedTime = parseISO(dateTime);
  // console.log(parsedTime); // 2019-10-25T08:10:00.000Z

  const formattedTime = formatInTimeZone(
    parsedTime,
    'yyyy-MM-dd kk:mm:ss',
    'UTC'
  );
  // console.log(formattedTime); // 2019-10-25 08:10:00 +00:00
  return formattedTime;
}
