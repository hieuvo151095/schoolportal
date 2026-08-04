import { MessageBar, MessageBarBody } from '@fluentui/react-components'
import { getKyCanNhac } from './reminderLogic'

export function ReminderBanner() {
  const kyCanNhac = getKyCanNhac()
  if (!kyCanNhac) return null

  if (kyCanNhac.soNgayConLai < 0) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          Đã quá hạn {Math.abs(kyCanNhac.soNgayConLai)} ngày — vui lòng đồng bộ dữ liệu hoá đơn kỳ {kyCanNhac.ky} ngay.
        </MessageBarBody>
      </MessageBar>
    )
  }

  return (
    <MessageBar intent="warning">
      <MessageBarBody>
        Còn {kyCanNhac.soNgayConLai} ngày để đồng bộ dữ liệu hoá đơn kỳ {kyCanNhac.ky}.
      </MessageBarBody>
    </MessageBar>
  )
}
