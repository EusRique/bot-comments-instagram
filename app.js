const puppeter = require('puppeteer')

// Ler a página do instagram
const start = async () => {

  async function loadMore(page, selector) {
    const moreButton = await page.$(selector)
    if (moreButton) {
      console.log('MORE')
      await moreButton.click()
      await page.waitFor(selector, { timeout: 3000 }).catch(() => { console.log("timeout") })
      await loadMore(page, selector)
    }
  }

  //pegar os comentários | arrobas
  async function getComments(page, selector) {
    const comments = await page.$$eval(selector, links => links.map(link => link.innerText))
    return comments
  }
  
  const browser = await puppeter.launch()
  const page = await browser.newPage()
  await page.goto('https://www.instagram.com/p/CChMVvQgYKK/')

  await loadMore(page, '.dCJp8')
  const commentedProfiles = await getComments(page, '.C4VMK span a')
  const countedCommentedProfiles = countProfile(commentedProfiles)
  const ordenProfile = sortProfile(countedCommentedProfiles)
  ordenProfile.forEach(arroba => { console.log(arroba) })

  await browser.close()
}

//Contar arrobas repetidas
const countProfile = (profiles) => {
  const count = {}
  profiles.forEach(profile => {
    count[profile] = (count[profile] || 0) + 1
  });

  return count
}

//Ordenar
const sortProfile = (profile) => {
  const entriesProfiles = Object.entries(profile)
  const orderedProfile = entriesProfiles.sort((a, b) => b[1] - a[1])

  return orderedProfile
}

start()