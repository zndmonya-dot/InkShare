'use client'

import { useCallback } from 'react'
import type { PresenceStatus, CustomStatus } from '@/types/status'
import { StatusButton } from './StatusButton'
import { CustomStatusModal } from './CustomStatusModal'
import { STATUS_OPTIONS, CUSTOM_STATUS_COLORS } from '@/constants/statusOptions'

interface StatusPanelProps {
  currentStatus: PresenceStatus
  customStatus1: CustomStatus
  customStatus2: CustomStatus
  onStatusChange: (status: PresenceStatus) => void
  onCustomEdit: (customId: 'custom1' | 'custom2') => void
  showCustomModal: 'custom1' | 'custom2' | null
  onCloseCustomModal: () => void
  onCustomSave: (label: string, icon: string) => void
}

export function StatusPanel({
  currentStatus,
  customStatus1,
  customStatus2,
  onStatusChange,
  onCustomEdit,
  showCustomModal,
  onCloseCustomModal,
  onCustomSave,
}: StatusPanelProps) {
  // カスタムボタンのクリックハンドラーを生成
  const createCustomHandlers = useCallback(
    (customId: 'custom1' | 'custom2') => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onStatusChange(customId)
      },
      onDoubleClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onCustomEdit(customId)
      },
    }),
    [onStatusChange, onCustomEdit]
  )

  const custom1Handlers = createCustomHandlers('custom1')
  const custom2Handlers = createCustomHandlers('custom2')

  const currentCustomStatus = showCustomModal === 'custom1' ? customStatus1 : customStatus2

  return (
    <div className="w-full h-full overflow-visible">
      {/* ステータスボタングリッド */}
      <div className="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 md:gap-4 h-full overflow-visible">
        {STATUS_OPTIONS.map((option) => (
          <StatusButton
            key={option.status}
            label={option.label}
            icon={option.icon}
            isActive={currentStatus === option.status}
            activeColor={option.activeColor}
            glowColor={option.glowColor}
            onClick={() => onStatusChange(option.status)}
          />
        ))}

        {/* カスタム1 */}
        <div className="contents">
          <StatusButton
            label={customStatus1.label}
            icon={customStatus1.icon}
            isActive={currentStatus === 'custom1'}
            activeColor={CUSTOM_STATUS_COLORS.custom1.activeColor}
            glowColor={CUSTOM_STATUS_COLORS.custom1.glowColor}
            onClick={custom1Handlers.onClick}
            onDoubleClick={custom1Handlers.onDoubleClick}
          />
        </div>

        {/* カスタム2 */}
        <div className="contents">
          <StatusButton
            label={customStatus2.label}
            icon={customStatus2.icon}
            isActive={currentStatus === 'custom2'}
            activeColor={CUSTOM_STATUS_COLORS.custom2.activeColor}
            glowColor={CUSTOM_STATUS_COLORS.custom2.glowColor}
            onClick={custom2Handlers.onClick}
            onDoubleClick={custom2Handlers.onDoubleClick}
          />
        </div>
      </div>

      {/* カスタムステータス編集モーダル */}
      <CustomStatusModal
        isOpen={showCustomModal !== null}
        currentStatus={currentCustomStatus}
        onClose={onCloseCustomModal}
        onSave={onCustomSave}
      />
    </div>
  )
}
