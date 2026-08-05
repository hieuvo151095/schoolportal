import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getKyOptions } from '../../utils/ky'
import { DanhSachTab } from './DanhSachTab'

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
  const kyOptions = getKyOptions()

  return (
    <div className={styles.root}>
      <Title2>Hoá đơn</Title2>

      <TabList selectedValue={tab} onTabSelect={(_, data: SelectTabData) => setTab(data.value as TabValue)}>
        <Tab value="danh-sach">Danh sách hoá đơn</Tab>
        <Tab value="lich-su">Lịch sử đồng bộ</Tab>
      </TabList>

      {tab === 'danh-sach' ? (
        <DanhSachTab />
      ) : (
        <SyncHistorySection
          loaiDuLieu="hoaDon"
          contextLabel="Kỳ báo cáo"
          contextOptions={kyOptions}
          successCountLabel="Số hoá đơn thành công"
        />
      )}
    </div>
  )
}
