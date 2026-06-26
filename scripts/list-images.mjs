import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Curated images live under Images/selected/{food,event,posters}; the raw
// Images/ dump is gitignored. This lists what is curated + what shipped to
// public/images so the two can be reconciled.
function listDir(dir) {
  try {
    return readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f))
  } catch {
    return []
  }
}

for (const sub of ['food', 'event', 'posters']) {
  const dir = join('Images', 'selected', sub)
  const files = listDir(dir)
  console.log(`\n[selected/${sub}] (${files.length})`)
  for (const f of files) console.log('  ', f)
}

const shipped = listDir('public/images')
console.log(`\n[public/images] (${shipped.length})`)
for (const f of shipped) console.log('  ', f)
