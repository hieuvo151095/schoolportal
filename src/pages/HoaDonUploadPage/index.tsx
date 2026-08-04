import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getKyOptions } from '../../utils/ky'
import { DanhSachTab } from './DanhSachTab'
import { hoaDonUploadConfig } from './hoaDonUploadConfig'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
})

type TabValue = 'danh-sach' | 'lich-su'

export function HoaDonUploadPage() {
  const styles = useStyles()
  const [tab, setTab] = useState<TabValue>('danh-sach')
  const [listKey, setListKey] = useState(0)
  const [historyKey, setHistoryKey] = useState(0)
  const kyOptions = getKyOptions()

  function handleConfirmed() {
    setListKey((k) => k + 1)
    setHistoryKey((k) => k + 1)
  }

  return (
    <div className={styles.root}>
      <Title2>Hoá đơn</Title2>

      <TabList selectedValue={tab} onTabSelect={(_, data: SelectTabData) => setTab(data.value as TabValue)}>
        <Tab value="danh-sach">Danh sách hoá đơn</Tab>
        <Tab value="lich-su">Lịch sử đồng bộ</Tab>
      </TabList>

      {tab === 'danh-sach' ? (
        <DanhSachTab key={listKey} />
      ) : (
        <SyncHistorySection
          key={historyKey}
          loaiDuLieu="hoaDon"
          contextLabel="Kỳ báo cáo"
          contextOptions={kyOptions}
          successCountLabel="Số hoá đơn thành công"
          uploadConfig={hoaDonUploadConfig}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  )
}
