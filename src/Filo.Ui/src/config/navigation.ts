import type { NavItem } from '@/types/navigation'

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Projects',
    href: '/projects',
    megaMenu: {
      projects: [
        {
          name: 'Filo',
          description:
            'A modern platform for managing files, collaboration spaces, permissions, and team workflows across organizations.',
          technologies: ['.NET', 'React', 'Azure', 'Clean Architecture', 'Docker', 'PostgreSQL'],
          href: '/projects/filo',
        },
      ],
    },
  },
  {
    label: 'Solutions',
    href: '/solutions',
  },
  {
    label: 'Repository',
    href: 'https://github.com/EmperorXSama/Filo',
    external: true,
  },
  {
    label: 'Company',
    href: '/company',
  },
]
