// Web Push通知のヘルパー関数

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('このブラウザは通知をサポートしていません')
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  return permission
}

export function checkNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (checkNotificationPermission() !== 'granted') {
    console.warn('通知の許可が必要です')
    return
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      ...options,
    })
  } else {
    // Service Workerが使えない場合は通常の通知
    new Notification(title, {
      icon: '/icon.svg',
      ...options,
    })
  }
}

// ステータス変更通知
export async function notifyStatusChange(
  userName: string,
  newStatus: string,
  statusLabel: string
): Promise<void> {
  await showLocalNotification('Inkshare', {
    body: `${userName}さんが「${statusLabel}」に変更しました`,
    tag: 'status-change',
    requireInteraction: false,
    data: {
      type: 'status-change',
      userName,
      status: newStatus,
    },
  })
}

// メンバー参加通知
export async function notifyMemberJoined(userName: string): Promise<void> {
  await showLocalNotification('Inkshare', {
    body: `${userName}さんがチームに参加しました`,
    tag: 'member-joined',
    requireInteraction: false,
    data: {
      type: 'member-joined',
      userName,
    },
  })
}

