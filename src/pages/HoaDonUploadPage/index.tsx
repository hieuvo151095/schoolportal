import {
  Dropdown,
  Field,
  MessageBar,
  MessageBarBody,
  Option,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { UploadWizard } from '../../upload-engine/UploadWizard'
import { DEFAULT_KY, getKyOptions } from '../../utils/ky'
import { hoaDonUploadConfig } from './hoaDonUploadConfig'
import { getKyCanNhac } from './reminderLogic'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  contextField: {
    maxWidth: '280px',
  },
})

export function HoaDonUploadPage() {
  const styles = useStyles()
  const [ky, setKy] = useState(DEFAULT_KY)
  const kyOptions = getKyOptions()
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  const kyCanNhac = getKyCanNhac()

  return (
    <div className={styles.root}>
      <Title2>Hoá đơn</Title2>

      {kyCanNhac &&
        (kyCanNhac.soNgayConLai < 0 ? (
          <MessageBar intent="error">
            <MessageBarBody>
              Đã quá hạn {Math.abs(kyCanNhac.soNgayConLai)} ngày — vui lòng đồng bộ dữ liệu hoá đơn kỳ{' '}
              {kyCanNhac.ky} ngay.
            </MessageBarBody>
          </MessageBar>
        ) : (
          <MessageBar intent="warning">
            <MessageBarBody>
              Còn {kyCanNhac.soNgayConLai} ngày để đồng bộ dữ liệu hoá đơn kỳ {kyCanNhac.ky}.
            </MessageBarBody>
          </MessageBar>
        ))}

      <Field label="Kỳ báo cáo áp dụng cho lần đồng bộ này (bắt buộc)" className={styles.contextField}>
        <Dropdown value={ky} selectedOptions={[ky]} onOptionSelect={(_, data) => data.optionValue && setKy(data.optionValue)}>
          {kyOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <UploadWizard
        key={ky}
        config={hoaDonUploadConfig}
        contextValue={ky}
        onConfirmed={() => setHistoryRefreshKey((k) => k + 1)}
      />

      <SyncHistorySection
        key={historyRefreshKey}
        loaiDuLieu="hoaDon"
        contextLabel="Kỳ báo cáo"
        contextOptions={kyOptions}
        successCountLabel="Số hoá đơn thành công"
      />
    </div>
  )
}
