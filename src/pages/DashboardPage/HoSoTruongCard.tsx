import {
  Body1,
  Button,
  Caption1,
  Card,
  Dropdown,
  Field,
  Input,
  Option,
  Subtitle2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { DismissRegular, EditRegular, SaveRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { getHoSoTruong, saveHoSoTruong } from '../../storage/hoSoTruong'
import type { CapHoc, HeThongDoiTac, HoSoTruong } from '../../types/domain'
import { getNienKhoaOptions } from '../../utils/nienKhoa'

const CAP_HOC_LIST: CapHoc[] = ['Mầm non', 'Tiểu học', 'THCS', 'THPT']

const HE_THONG_DOI_TAC_LIST: HeThongDoiTac[] = [
  'SSC',
  'Misa',
  'Viettel',
  'VNPT',
  'eNetViet',
  'YoYoSchool',
  'ECO School',
]

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalS,
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

export function HoSoTruongCard() {
  const styles = useStyles()
  const [hoSo, setHoSo] = useState<HoSoTruong | null>(() => getHoSoTruong())
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<HoSoTruong | null>(hoSo)
  const nienKhoaOptions = getNienKhoaOptions()

  if (!hoSo) return null

  function update<K extends keyof HoSoTruong>(key: K, value: HoSoTruong[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function startEdit() {
    setDraft(hoSo)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function saveEdit() {
    if (!draft) return
    saveHoSoTruong(draft)
    setHoSo(draft)
    setEditing(false)
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Subtitle2>Hồ sơ trường</Subtitle2>
        {editing ? (
          <div className={styles.actions}>
            <Button appearance="secondary" icon={<DismissRegular />} onClick={cancelEdit}>
              Huỷ
            </Button>
            <Button appearance="primary" icon={<SaveRegular />} onClick={saveEdit}>
              Lưu
            </Button>
          </div>
        ) : (
          <Button appearance="secondary" icon={<EditRegular />} onClick={startEdit}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      {editing && draft ? (
        <div className={styles.grid}>
          <Field label="Mã trường">
            <Input value={draft.maTruong} disabled />
          </Field>
          <Field label="Tên trường">
            <Input value={draft.tenTruong} onChange={(_, data) => update('tenTruong', data.value)} />
          </Field>
          <Field label="Xã/Phường">
            <Input value={draft.xaPhuong} onChange={(_, data) => update('xaPhuong', data.value)} />
          </Field>
          <Field label="Cấp học">
            <Dropdown
              value={draft.capHoc}
              selectedOptions={[draft.capHoc]}
              onOptionSelect={(_, data) => data.optionValue && update('capHoc', data.optionValue as CapHoc)}
            >
              {CAP_HOC_LIST.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Hệ thống đối tác">
            <Dropdown
              value={draft.heThongDoiTac}
              selectedOptions={[draft.heThongDoiTac]}
              onOptionSelect={(_, data) =>
                data.optionValue && update('heThongDoiTac', data.optionValue as HeThongDoiTac)
              }
            >
              {HE_THONG_DOI_TAC_LIST.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Niên khoá đang hoạt động">
            <Dropdown
              value={draft.nienKhoa}
              selectedOptions={[draft.nienKhoa]}
              onOptionSelect={(_, data) => data.optionValue && update('nienKhoa', data.optionValue)}
            >
              {nienKhoaOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Field>
        </div>
      ) : (
        <div className={styles.grid}>
          <InfoItem label="Mã trường" value={hoSo.maTruong} />
          <InfoItem label="Tên trường" value={hoSo.tenTruong} />
          <InfoItem label="Xã/Phường" value={hoSo.xaPhuong} />
          <InfoItem label="Cấp học" value={hoSo.capHoc} />
          <InfoItem label="Hệ thống đối tác" value={hoSo.heThongDoiTac} />
          <InfoItem label="Niên khoá đang hoạt động" value={hoSo.nienKhoa} />
        </div>
      )}
    </Card>
  )
}
