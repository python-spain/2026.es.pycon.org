import { describe, it, expect } from 'vitest'
import { texts as homeTexts } from '../home'
import { menuTexts } from '../menu/index'
import { accommodationTexts } from '../accommodation/index'
import { texts as cocTexts } from '../code-of-conduct/index'
import { locationTexts } from '../location/index'
import { texts as sponsorsTexts } from '../sponsors/index'
import { texts as lpTexts } from '../components/LanguagePicker'

describe('Internationalization Keys Consistency', () => {
  const testConsistency = (moduleName: string, moduleTexts: any) => {
    it(`${moduleName} translations should have consistent keys across all languages`, () => {
      const locales = ['es', 'en', 'ca']
      const esKeys = Object.keys(moduleTexts.es).sort()
      
      for (const locale of locales) {
        const currentKeys = Object.keys(moduleTexts[locale]).sort()
        expect(currentKeys, `${locale} keys for ${moduleName} do not match Spanish keys`).toEqual(esKeys)
      }
    })
  }

  testConsistency('home', homeTexts)
  testConsistency('menu', menuTexts)
  testConsistency('accommodation', accommodationTexts)
  testConsistency('code-of-conduct', cocTexts)
  testConsistency('location', locationTexts)
  testConsistency('sponsors', sponsorsTexts)
  testConsistency('LanguagePicker', lpTexts)
})
