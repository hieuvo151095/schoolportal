import { Body1, Caption1, Card, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
import { getHoSoTruong } from '../../storage/hoSoTruong'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalM,
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
})

interface InfoItemProps {
  label: string
  value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  const styles = useStyles()
  return (
    <div className={styles.infoItem}>
      <Caption1>{label}</Caption1>
      <Body1>{value}</Body1>
    </div>
  )
}

/** Hồ sơ trường giờ THUẦN XEM — dữ liệu do Sở quản lý/đồng bộ xuống, trường không còn tự sửa
 * (tương tự tinh thần Danh mục thu). */
export function HoSoTruongCard() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()

  if (!hoSo) return null

  return (
    <Card className={styles.card}>
      <Subtitle2>Hồ sơ trường</Subtitle2>

      <div className={styles.grid}>
        <InfoItem label="Mã trường" value={hoSo.maTruong} />
        <InfoItem label="Tên trường" value={hoSo.tenTruong} />
        <InfoItem label="Xã/Phường" value={hoSo.xaPhuong} />
        <InfoItem label="Cấp học" value={hoSo.capHoc} />
        <InfoItem label="Hệ thống đối tác" value={hoSo.heThongDoiTac} />
        <InfoItem label="Niên khoá đang hoạt động" value={hoSo.nienKhoa} />
      </div>
    </Card>
  )
}
