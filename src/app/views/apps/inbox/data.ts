const small1 = 'assets/images/small/img-1.jpg'
const small2 = 'assets/images/small/img-2.jpg'
const small3 = 'assets/images/small/img-3.jpg'
const small4 = 'assets/images/small/img-4.jpg'

export type EmailBodyImage = {
  image: string
}

export type EmailBodyFile = {
  icon: string
  title: string
  variant: string
}

export const emailBodyImageData: EmailBodyImage[] = [
  {
    image: small1,
  },
  {
    image: small2,
  },
  {
    image: small3,
  },
  {
    image: small4,
  },
]

export const emailBodyFileData: EmailBodyFile[] = [
  {
    icon: 'solar:file-download-bold',
    title: 'Project About..',
    variant: 'primary',
  },
  {
    icon: 'solar:figma-file-bold',
    title: 'Photo Psd...',
    variant: 'success',
  },
  {
    icon: 'solar:checklist-minimalistic-bold',
    title: 'Price List...',
    variant: 'danger',
  },
]
