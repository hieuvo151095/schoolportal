import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { DanhSachTab } from './DanhSachTab'

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
  const nienKhoaOptions = getNienKhoaOptions()

  return (
    <div className={styles.root}>
      <Title2>Học sinh</Title2>

      <TabList selectedValue={tab} onTabSelect={(_, data: SelectTabData) => setTab(data.value as TabValue)}>
        <Tab value="danh-sach">Danh sách học sinh</Tab>
        <Tab value="lich-su">Lịch sử đồng bộ</Tab>
      </TabList>

      {tab === 'danh-sach' ? (
        <DanhSachTab />
      ) : (
        <SyncHistorySection
          loaiDuLieu="hocSinh"
          contextLabel="Niên khoá"
          contextOptions={nienKhoaOptions}
          successCountLabel="Số học sinh thành công"
        />
      )}
    </div>
  )
}
