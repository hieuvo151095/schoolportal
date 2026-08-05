import { Toast, ToastTitle, Toaster, useId, useToastController } from '@fluentui/react-components'

const APP_TOASTER_ID = 'app-toaster'

/** Đặt 1 lần ở gốc layout (PortalShell) — góc trên phải theo mặc định của Fluent UI Toaster. */
export function AppToaster() {
  return <Toaster toasterId={APP_TOASTER_ID} position="top-end" />
}

/** Hook dùng ở bất kỳ trang nào để bắn toast thành công, tự ẩn sau vài giây (mặc định Fluent
 * UI Toast timeout) — dùng cho toast "Đã thêm mới dữ liệu thành công" ở form Thêm mới. */
export function useAppToast() {
  const { dispatchToast } = useToastController(APP_TOASTER_ID)
  const toastId = useId('toast')

  function showSuccess(message: string) {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: 'success', toastId },
    )
  }

  return { showSuccess }
}
