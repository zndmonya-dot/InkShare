'use client'

import { useCallback, useState, useEffect, useMemo, memo } from 'react'
import type { PresenceStatus, CustomStatus } from '@/types'
import { StatusButton } from './StatusButton'
import { STATUS_OPTIONS, CUSTOM_STATUS_CONFIG } from '@/config/status'

interface StatusPanelProps {
  currentStatus: PresenceStatus
  customStatus1: CustomStatus
  customStatus2: CustomStatus
  customStatus3: CustomStatus
  customStatus4: CustomStatus
  onStatusChange: (status: PresenceStatus) => void
  onCustomClick: (customId: 'custom1' | 'custom2' | 'custom3' | 'custom4') => void
}

interface StatusItem {
  id: string
  type: 'preset' | 'custom'
  status?: PresenceStatus
  customId?: 'custom1' | 'custom2' | 'custom3' | 'custom4'
}

export const StatusPanel = memo(function StatusPanel({
  currentStatus,
  customStatus1,
  customStatus2,
  customStatus3,
  customStatus4,
  onStatusChange,
  onCustomClick,
}: StatusPanelProps) {
  // ステータスアイテムの順序を管理
  const [statusItems, setStatusItems] = useState<StatusItem[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  // 初回マウント時のみアニメーションを表示
  useEffect(() => {
    // sessionStorageで初回表示かチェック
    const hasShownBefore = sessionStorage.getItem('statusPanelShown')
    if (!hasShownBefore) {
      // 初回表示：アニメーションあり
      setShouldAnimate(true)
      sessionStorage.setItem('statusPanelShown', 'true')
    }
    // 常に即座に表示
  }, [])

  // 初期化：localStorageから順序を読み込むか、デフォルト順序を使用
  useEffect(() => {
    const savedOrder = localStorage.getItem('status-order')
    if (savedOrder) {
      try {
        setStatusItems(JSON.parse(savedOrder))
      } catch {
        setStatusItems(getDefaultOrder())
      }
    } else {
      setStatusItems(getDefaultOrder())
    }
  }, [])

  // デフォルトの順序を取得
  const getDefaultOrder = (): StatusItem[] => {
    const presetItems: StatusItem[] = STATUS_OPTIONS.map(option => ({
      id: option.status,
      type: 'preset',
      status: option.status,
    }))
    return [
      ...presetItems,
      { id: 'custom1', type: 'custom', customId: 'custom1' },
      { id: 'custom2', type: 'custom', customId: 'custom2' },
      { id: 'custom3', type: 'custom', customId: 'custom3' },
      { id: 'custom4', type: 'custom', customId: 'custom4' },
    ]
  }

  // 順序をlocalStorageに保存
  const saveOrder = (items: StatusItem[]) => {
    localStorage.setItem('status-order', JSON.stringify(items))
  }

  // カスタムボタンのクリックハンドラーを生成
  const createCustomHandlers = useCallback(
    (customId: 'custom1' | 'custom2' | 'custom3' | 'custom4') => ({
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

  const custom1Handlers = useMemo(() => createCustomHandlers('custom1'), [createCustomHandlers])
  const custom2Handlers = useMemo(() => createCustomHandlers('custom2'), [createCustomHandlers])
  const custom3Handlers = useMemo(() => createCustomHandlers('custom3'), [createCustomHandlers])
  const custom4Handlers = useMemo(() => createCustomHandlers('custom4'), [createCustomHandlers])

  // ドラッグ開始
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
    setDraggedIndex(index)
  }

  // ドラッグオーバー
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(index)
      return
    }
    
    // カスタムステータスへのドロップは許可しない
    const targetItem = statusItems[index]
    if (targetItem.type === 'custom') {
      setDragOverIndex(null)
      return
    }

    const newItems = [...statusItems]
    const draggedItem = newItems[draggedIndex]
    
    // カスタムステータスはドラッグできない
    if (draggedItem.type === 'custom') {
      setDragOverIndex(null)
      return
    }
    
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    
    setStatusItems(newItems)
    setDraggedIndex(index)
    setDragOverIndex(index)
  }

  // ドラッグ終了
  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveOrder(statusItems)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className={`w-full overflow-visible relative ${shouldAnimate ? 'animate-fade-in-scale' : ''}`}>
      {/* ドラッグ中のヒント */}
      {draggedIndex !== null && (
        <div className="absolute top-0 left-0 right-0 text-center py-2 bg-ink-yellow/80 text-splat-dark text-sm font-bold rounded-lg shadow-lg z-50 animate-pulse">
          <i className="ri-drag-move-2-fill mr-2"></i>
          ドラッグして配置を変更中...
        </div>
      )}
      
      {/* ステータスボタングリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 overflow-visible max-w-4xl mx-auto">
        {statusItems.map((item, index) => {
          // プリセットステータス
          if (item.type === 'preset' && item.status) {
            const option = STATUS_OPTIONS.find(opt => opt.status === item.status)
            if (!option) return null

            return (
              <div
                key={item.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-move select-none aspect-square ${
                  draggedIndex === index 
                    ? 'opacity-50 scale-95' 
                    : dragOverIndex === index && draggedIndex !== null
                    ? 'ring-4 ring-ink-yellow scale-105'
                    : 'hover:scale-[1.01]'
                }`}
                style={{ 
                  touchAction: 'pan-y',
                  transition: 'all 0.35s cubic-bezier(0.3, 0, 0.1, 1)',
                }}
              >
                <StatusButton
                  label={option.label}
                  icon={option.icon}
                  isActive={currentStatus === option.status}
                  activeColor={option.activeColor}
                  glowColor={option.glowColor}
                  onClick={() => onStatusChange(option.status)}
                />
              </div>
            )
          }

          // カスタムステータス
          if (item.type === 'custom' && item.customId) {
            let customStatus: CustomStatus & { color?: string }
            let config
            let handlers
            
            if (item.customId === 'custom1') {
              customStatus = customStatus1
              config = CUSTOM_STATUS_CONFIG.custom1
              handlers = custom1Handlers
            } else if (item.customId === 'custom2') {
              customStatus = customStatus2
              config = CUSTOM_STATUS_CONFIG.custom2
              handlers = custom2Handlers
            } else if (item.customId === 'custom3') {
              customStatus = customStatus3
              config = CUSTOM_STATUS_CONFIG.custom3
              handlers = custom3Handlers
            } else {
              customStatus = customStatus4
              config = CUSTOM_STATUS_CONFIG.custom4
              handlers = custom4Handlers
            }
            
            // カスタムの色が設定されていればそれを使用、なければデフォルト
            const activeColor = (customStatus as any).color || config.activeColor
            const glowColor = activeColor.replace('bg-', 'shadow-') + '/50'

            return (
              <div
                key={item.id}
                className={`cursor-default relative aspect-square ${
                  dragOverIndex === index && draggedIndex !== null
                    ? 'ring-2 ring-red-500/50 opacity-50'
                    : ''
                }`}
                style={{ 
                  transition: 'all 0.35s cubic-bezier(0.3, 0, 0.1, 1)',
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'none'
                  setDragOverIndex(index)
                }}
                onDragLeave={() => setDragOverIndex(null)}
              >
                <StatusButton
                  label={customStatus.label}
                  icon={customStatus.icon}
                  isActive={currentStatus === item.customId}
                  activeColor={activeColor}
                  glowColor={glowColor}
                  onClick={handlers.onClick}
                  onDoubleClick={handlers.onDoubleClick}
                />
                {dragOverIndex === index && draggedIndex !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl pointer-events-none">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      <i className="ri-close-circle-fill mr-1"></i>
                      カスタムは移動不可
                    </div>
                  </div>
                )}
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
})
