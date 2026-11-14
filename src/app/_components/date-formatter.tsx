import { formatDate, type DateStyle } from "@/lib/dates";

type Props = {
  dateString: string;
  style?: DateStyle;
  className?: string;
};

const DateFormatter = ({ dateString, style, className }: Props) => {
  return (
    <time dateTime={dateString} className={className}>
      {formatDate(dateString, style)}
    </time>
  );
};

export default DateFormatter;
