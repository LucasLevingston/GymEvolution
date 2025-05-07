export const getInitials = (name: string | undefined) => {
  return name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : null
}
