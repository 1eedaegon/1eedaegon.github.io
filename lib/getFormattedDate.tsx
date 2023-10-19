export default function getFormattedDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(
    new Date(dateString)
  );
}
