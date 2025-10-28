'use client'

import { useCallback } from 'react'
import type { PresenceStatus, CustomStatus } from '@/types'
import { StatusButton } from './StatusButton'
import { STATUS_OPTIONS, CUSTOM_STATUS_CONFIG } from '@/config/status'

interface StatusPanelProps {
  currentStatus: PresenceStatus
  customStatus1: CustomStatus
  customStatus2: CustomStatus
  onStatusChange: (status: PresenceStatus) => void
  onCustomClick: (customId: 'custom1' | 'custom2') => void
}

export function StatusPanel({
  currentStatus,
  customStatus1,
  customStatus2,
  onStatusChange,
  onCustomClick,
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
        onCustomClick(customId)
      },
    }),
    [onStatusChange, onCustomClick]
  )

  const custom1Handlers = createCustomHandlers('custom1')
  const custom2Handlers = createCustomHandlers('custom2')

  return (
    <div className="w-full h-full overflow-visible relative">
      {/* ステータスボタングリッド */}
      <div className="grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 md:gap-5 h-full overflow-visible max-w-4xl mx-auto">
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
            activeColor={CUSTOM_STATUS_CONFIG.custom1.activeColor}
            glowColor={CUSTOM_STATUS_CONFIG.custom1.glowColor}
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
            activeColor={CUSTOM_STATUS_CONFIG.custom2.activeColor}
            glowColor={CUSTOM_STATUS_CONFIG.custom2.glowColor}
            onClick={custom2Handlers.onClick}
            onDoubleClick={custom2Handlers.onDoubleClick}
          />
        </div>
      </div>
    </div>
  )
}
