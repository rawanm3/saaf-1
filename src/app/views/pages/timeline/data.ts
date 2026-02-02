export type TimelineType = {
  [key: string]: {
    title: string
    description: string
    important?: boolean
  }[]
}

export const timelineData: TimelineType = {
  Today: [
    {
      title: 'Completed UX design project for our client',
      description:
        'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      important: true,
    },
    {
      title: 'Yes! We are celebrating our first admin release.',
      description:
        'Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident.',
    },
    {
      title: 'We released new version of our theme.',
      description: '3 new photo Uploaded on facebook fan page',
    },
  ],
  Yesterday: [
    {
      title: 'We have archieved 25k sales in our themes',
      description:
        'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
    },
    {
      title: 'Yes! We are celebrating our first admin release.',
      description:
        'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson.',
    },
  ],
}
