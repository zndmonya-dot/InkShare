'use client'

import { useCallback, useState, useEffect } from 'react'
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

interface StatusItem {
  id: string
  type: 'preset' | 'custom'
  status?: PresenceStatus
  customId?: 'custom1' | 'custom2'
}

export function StatusPanel({
  currentStatus,
  customStatus1,
  customStatus2,
  onStatusChange,
  onCustomClick,
}: StatusPanelProps) {
  // ステータスアイテムの順序を管理
  const [statusItems, setStatusItems] = useState<StatusItem[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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
    ]
  }

  // 順序をlocalStorageに保存
  const saveOrder = (items: StatusItem[]) => {
    localStorage.setItem('status-order', JSON.stringify(items))
  }

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
    <div className="w-full h-full overflow-visible relative">
      {/* ドラッグ中のヒント */}
      {draggedIndex !== null && (
        <div className="absolute top-0 left-0 right-0 text-center py-2 bg-ink-yellow/80 text-splat-dark text-sm font-bold rounded-lg shadow-lg z-50 animate-pulse">
          <i className="ri-drag-move-2-fill mr-2"></i>
          ドラッグして配置を変更中...
        </div>
      )}
      
      {/* ステータスボタングリッド */}
      <div className="grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 md:gap-5 h-full overflow-visible max-w-4xl mx-auto">
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
                className={`cursor-move transition-all select-none ${
                  draggedIndex === index 
                    ? 'opacity-50 scale-95' 
                    : dragOverIndex === index && draggedIndex !== null
                    ? 'ring-4 ring-ink-yellow scale-105'
                    : 'hover:scale-[1.02]'
                }`}
                style={{ touchAction: 'none' }}
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
            const isCustom1 = item.customId === 'custom1'
            const customStatus = isCustom1 ? customStatus1 : customStatus2
            const config = isCustom1 ? CUSTOM_STATUS_CONFIG.custom1 : CUSTOM_STATUS_CONFIG.custom2
            const handlers = isCustom1 ? custom1Handlers : custom2Handlers
            
            // カスタムの色が設定されていればそれを使用、なければデフォルト
            const activeColor = (customStatus as any).color || config.activeColor
            const glowColor = activeColor.replace('bg-', 'shadow-') + '/50'

            return (
              <div
                key={item.id}
                className={`cursor-default transition-all relative ${
                  dragOverIndex === index && draggedIndex !== null
                    ? 'ring-2 ring-red-500/50 opacity-50'
                    : ''
                }`}
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
}
