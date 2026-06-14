export interface MegaMenuLink {
  label: string
  href: string
  description?: string
}

export interface MegaMenuCard {
  heading: string
  description: string
  href: string
}

export interface MegaMenuColumn {
  title: string
  description?: string
  links?: MegaMenuLink[]
  card?: MegaMenuCard
  featured?: boolean
}

export interface ProjectCardConfig {
  name: string
  description: string
  technologies: string[]
  href: string
}

export interface MegaMenuConfig {
  columns?: MegaMenuColumn[]
  projects?: ProjectCardConfig[]
}

export interface NavItem {
  label: string
  href: string
  megaMenu?: MegaMenuConfig
  external?: boolean
}
