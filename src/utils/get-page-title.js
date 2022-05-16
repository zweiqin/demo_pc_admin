import defaultSettings from '@/settings'

const title = defaultSettings.title || 'demo——总后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
