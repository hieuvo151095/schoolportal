import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { DanhSachTab } from './DanhSachTab'
import { hocSinhUploadConfig } from './hocSinhUploadConfig'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
})

type TabValue = 'danh-sach' | 'lich-su'

export function HocSinhUploadPage() {
  const styles = useStyles()
  const [tab, setTab] = useState<TabValue>('danh-sach')
  const [listKey, setListKey] = useState(0)
  const [historyKey, setHistoryKey] = useState(0)
  const nienKhoaOptions = getNienKhoaOptions()
  const hoSo = getHoSoTruong()

  function handleConfirmed() {
    setListKey((k) => k + 1)
    setHistoryKey((k) => k + 1)
  }

  return (
    <div className={styles.root}>
      <Title2>Học sinh</Title2>

      <TabList selectedValue={tab} onTabSelect={(_, data: SelectTabData) => setTab(data.value as TabValue)}>
        <Tab value="danh-sach">Danh sách học sinh</Tab>
        <Tab value="lich-su">Lịch sử đồng bộ</Tab>
      </TabList>

      {tab === 'danh-sach' ? (
        <DanhSachTab key={listKey} />
      ) : (
        <SyncHistorySection
          key={historyKey}
          loaiDuLieu="hocSinh"
          contextLabel="Niên khoá"
          contextOptions={nienKhoaOptions}
          successCountLabel="Số học sinh thành công"
          uploadConfig={hocSinhUploadConfig}
          defaultContextValue={hoSo?.nienKhoa ?? nienKhoaOptions[0]}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  )
}
