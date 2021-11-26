import { FontFace } from '@types'
import EpilogueTtf from '@fonts/Epilogue/Epilogue.ttf'
import EpilogueItalicTtf from '@fonts/Epilogue/EpilogueItalic.ttf'

const Epilogue: FontFace[] = [
  {
    '@font-face': {
      fontFamily: 'Epilogue',
      src: `url(${EpilogueTtf}) format('truetype')`,
    },
  },
  {
    '@font-face': {
      fontFamily: 'EpilogueItalic',
      src: `url(${EpilogueItalicTtf}) format('truetype')`,
      fontStyle: 'italic,oblique',
    },
  },
]

export { Epilogue }
