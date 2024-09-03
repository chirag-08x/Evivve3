import { DateTime } from 'luxon';


export const convertToTimeZone = (time, timezone) => {
 

  const utcDate = DateTime.fromISO(time, { zone: 'utc' });

  // Convert the UTC date to the specified time zone
  const zonedDate = utcDate.setZone(timezone);
  
  // Format the date based on the time zone
  const formattedTime = zonedDate.toFormat('hh:mm a');
  // Parse the input time string and assume it's in the local time zone initially
  // const [timeString, period] = time.split(' ');
  // const [hours, minutes] = timeString.split(':');
  
  // // Create a DateTime object for the given time in UTC
  // const utcDate = DateTime.fromObject({
  //   hour: period === 'PM' && hours !== '12' ? parseInt(hours, 10) + 12 : period === 'AM' && hours === '12' ? 0 : parseInt(hours, 10),
  //   minute: parseInt(minutes, 10),
  //   second: 0
  // }, { zone: 'utc' });
  
  // // Convert the UTC date to the specified time zone
  // const zonedDate = utcDate.setZone(timezone);

  // // Format the date based on the time zone
  // const formattedTime = zonedDate.toFormat('hh:mm a');

  

  return formattedTime;
};
