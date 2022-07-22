import { isAfter, isBefore, isEqual, format } from 'date-fns'

type verifyDataIntervalProps = {
  dataRef: string;
  initialDate: string;
  finalDate: string;
};

export const isValidIntervalDate = ({
  dataRef,
  initialDate,
  finalDate
}: verifyDataIntervalProps) => {
  const date = new Date(dataRef)
  const after = isAfter(date, new Date(initialDate))
  const before = isBefore(date, new Date(finalDate))
  const equal =
    isEqual(date, new Date(initialDate)) || isEqual(date, new Date(finalDate))
  const dataRefFormated = format(date, 'dd/MM/yyyy')
  const dateFinalFormated = format(new Date(finalDate), 'dd/MM/yyyy')
  const dateInitial = format(new Date(initialDate), 'dd/MM/yyyy')
  const isEqualAnywhere =
    dataRefFormated === dateFinalFormated || dataRefFormated === dateInitial
  return (after && before) || equal || isEqualAnywhere
}
