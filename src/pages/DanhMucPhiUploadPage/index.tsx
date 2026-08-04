import { Dropdown, Field, Option, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { UploadWizard } from '../../upload-engine/UploadWizard'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { danhMucPhiUploadConfig } from './danhMucPhiUploadConfig'

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

export function DanhMucPhiUploadPage() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()
  const [nienKhoa, setNienKhoa] = useState(hoSo?.nienKhoa ?? getNienKhoaOptions()[0])
  const nienKhoaOptions = getNienKhoaOptions()
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  return (
    <div className={styles.root}>
      <Title2>Danh mục Phí</Title2>

      <Field label="Niên khoá áp dụng cho lần đồng bộ này" className={styles.contextField}>
        <Dropdown
          value={nienKhoa}
          selectedOptions={[nienKhoa]}
          onOptionSelect={(_, data) => data.optionValue && setNienKhoa(data.optionValue)}
        >
          {nienKhoaOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <UploadWizard
        key={nienKhoa}
        config={danhMucPhiUploadConfig}
        contextValue={nienKhoa}
        onConfirmed={() => setHistoryRefreshKey((k) => k + 1)}
      />

      <SyncHistorySection
        key={historyRefreshKey}
        loaiDuLieu="danhMucPhi"
        contextLabel="Niên khoá"
        contextOptions={nienKhoaOptions}
        successCountLabel="Số dòng thành công"
      />
    </div>
  )
}
