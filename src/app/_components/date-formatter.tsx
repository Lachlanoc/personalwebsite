import { formatDate } from "@/lib/dates";

type Props = {
  dateString: string;
  className?: string;
};

const DateFormatter = ({ dateString, className }: Props) => {
  return (
    <time dateTime={dateString} className={className}>
      {formatDate(dateString)}
    </time>
  );
};

export default DateFormatter;
