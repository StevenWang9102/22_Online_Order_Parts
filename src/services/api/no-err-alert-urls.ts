const noErrAlertUrls = [
  'Product/GetProductById'
]

export const checkUrlAlertException = (url: string): boolean => {
  return !noErrAlertUrls.filter(row => url.includes(row))[0]
}
