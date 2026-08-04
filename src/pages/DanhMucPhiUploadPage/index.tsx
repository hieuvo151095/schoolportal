import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData } from '@fluentui/react-components'
import { useState } from 'react'
import { SyncHistorySection } from '../../components/sync-history/SyncHistorySection'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { danhMucPhiUploadConfig } from './danhMucPhiUploadConfig'
import { DanhSachTab } from './DanhSachTab'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
})

type TabValue = 'danh-sach' | 'lich-su'

export function DanhMucPhiUploadPage() {
  const styles = useStyles()
  const [tab, setTab] = useState<TabValue>('danh-sach')
  const [listKey, setListKey] = useState(0)
  const [historyKey, setHistoryKey] = useState(0)
  const nienKhoaOptions = getNienKhoaOptions()

  function handleConfirmed() {
    setListKey((k) => k + 1)
    setHistoryKey((k) => k + 1)
  }

  return (
    <div className={styles.root}>
      <Title2>Danh mục Phí</Title2>

      <TabList selectedValue={tab} onTabSelect={(_, data: SelectTabData) => setTab(data.value as TabValue)}>
        <Tab value="danh-sach">Danh sách danh mục phí</Tab>
        <Tab value="lich-su">Lịch sử đồng bộ</Tab>
      </TabList>

      {tab === 'danh-sach' ? (
        <DanhSachTab key={listKey} />
      ) : (
        <SyncHistorySection
          key={historyKey}
          loaiDuLieu="danhMucPhi"
          contextLabel="Niên khoá"
          contextOptions={nienKhoaOptions}
          successCountLabel="Số dòng thành công"
          uploadConfig={danhMucPhiUploadConfig}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  )
}
