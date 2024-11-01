export const getAvatarText = (name) => {
  const nameParts = name.trim().split(' ').filter(Boolean)

  const initials = nameParts.slice(0, 2).map((part) => part[0].toUpperCase())

  return initials.join('')
}

export const dateShiftFix = (vueDate, formData, dateColumns = []) => {
  dateColumns.forEach((dateColumn) => {
    if (formData[dateColumn])
      formData = {
        formData,
        [dateColumn]: vueDate.addDays(formData[dateColumn], 1) 
      }
  })

  return formData
}
