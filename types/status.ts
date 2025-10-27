// ステータスの型定義
export type PresenceStatus =
  | 'available'      // 話しかけてOK
  | 'busy'           // 取込中
  | 'want-to-talk'   // 誰か雑談しましょう
  | 'want-lunch'     // お昼誘ってください
  | 'need-help'      // 現在困っている
  | 'going-home'     // 定時で帰りたい
  | 'leaving'        // 帰宅
  | 'out'            // 外出中
  | 'custom1'        // カスタム1
  | 'custom2'        // カスタム2

export interface CustomStatus {
  label: string
  icon: string
}

