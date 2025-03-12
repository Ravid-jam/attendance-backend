export const calculateHours = (startTime, endTime) => {
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours + minutes / 60;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  return end - start;
};
