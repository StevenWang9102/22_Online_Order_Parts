import Swal from 'sweetalert2'

type inputTypes = 'textarea' | 'text' | 'number' | any

const getDefaultValue: (type:any) => any = (type:any) => {
  switch(type) {
    case 'textarea':
      return 'string'
    case 'text':
      return 'string'
    case 'number':
      return 0
    default:
      return 'string'
  }
}

export default class SweetAlertService {

  static successMessage = async (message?: string) => {
    await Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 2000
    })
  }
  static errorMessage = async (message?: any) => {
    await Swal.fire('Error!', message ? message : '', 'error')

  }
  static confirmMessage: (message?: any) => Promise<boolean> = async (message?: any) => {

    return await Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(res => {
      return !!res.value
    })

  }

  static inputConfirm = async ({ type, title = 'Confirm', placeholder = 'Comment', defaultValue = getDefaultValue(type) }: { type?: inputTypes; title?: string; placeholder?: string; defaultValue?: any}) => {

    return await Swal.fire({
      title: title,
      input: type,
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: placeholder,
        value: defaultValue
      },
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      allowOutsideClick: () => !Swal.isLoading()
    }).then(res => {
      return res.value || null
    })
  }
}
