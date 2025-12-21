import { Segmented, Tag } from 'antd'
import type { DirectionMode } from '../../hooks/useTextDirection'
import styles from './DirectionControls.module.scss'

interface DirectionControlsProps {
  directionMode: DirectionMode
  onDirectionChange: (mode: DirectionMode) => void
  resolvedDirection: 'ltr' | 'rtl'
  directionLabel: string
}

function DirectionControls({
  directionMode,
  onDirectionChange,
  resolvedDirection,
  directionLabel
}: DirectionControlsProps) {
  return (
    <div className={styles.metaRow}>
      <Tag color={resolvedDirection === 'rtl' ? 'volcano' : 'blue'}>{directionLabel}</Tag>
      <Segmented
        size="small"
        value={directionMode}
        onChange={(value) => onDirectionChange(value as DirectionMode)}
        options={[
          { label: 'Auto', value: 'auto' },
          { label: 'LTR', value: 'ltr' },
          { label: 'RTL', value: 'rtl' }
        ]}
      />
    </div>
  )
}

export default DirectionControls
