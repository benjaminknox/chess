import { FontFace } from '@types'
import AndadaPro from '@fonts/Andada/AndadaPro.ttf'
import AndadaProItalic from '@fonts/Andada/AndadaProItalic.ttf'

const Andada: FontFace[] = [
  {
    '@font-face': {
      fontFamily: 'Andada',
      src: `url(${AndadaPro}) format('truetype')`,
    },
  },
  {
    '@font-face': {
      fontFamily: 'AndadaItalic',
      src: `url(${AndadaProItalic}) format('truetype')`,
      fontStyle: 'italic,oblique',
    },
  },
]

export { Andada }
