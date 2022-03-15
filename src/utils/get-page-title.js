import defaultSettings from '@/settings'

const title = defaultSettings.title || '好邻邦物业管理信息系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
