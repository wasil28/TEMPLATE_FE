import Swal from 'sweetalert2'

export function useToast() {
  function success(message: string, title = 'Berhasil') {
    return Swal.fire({ icon: 'success', title, text: message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
  }

  function error(message: string, title = 'Terjadi Kesalahan') {
    return Swal.fire({ icon: 'error', title, text: message, toast: true, position: 'top-end', showConfirmButton: false, timer: 4000 })
  }

  function warning(message: string, title = 'Perhatian') {
    return Swal.fire({ icon: 'warning', title, text: message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3500 })
  }

  async function confirm(message: string, title = 'Konfirmasi'): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'question', title, text: message,
      showCancelButton: true, confirmButtonText: 'Ya', cancelButtonText: 'Batal',
      confirmButtonColor: '#0E5FB8',
    })
    return result.isConfirmed
  }

  function toast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    if (type === 'success') return success(message)
    if (type === 'error') return error(message)
    if (type === 'warning') return warning(message)
    return Swal.fire({ icon: 'info', title: 'Info', text: message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
  }

  return { success, error, warning, confirm, toast }
}
