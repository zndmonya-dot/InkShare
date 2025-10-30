import { M_PLUS_Rounded_1c, Kosugi_Maru } from 'next/font/google'

export const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-m-plus-rounded',
})

export const kosugiMaru = Kosugi_Maru({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kosugi-maru',
})

