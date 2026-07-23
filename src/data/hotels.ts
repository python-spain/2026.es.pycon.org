import type { IHotel } from '../types/hotels'

/** Recommended hotels with PyConES promo codes. */
export const hotels: IHotel[] = [
  {
    name: 'Travelodge Barcelona Poblenou',
    bookingUrl: 'https://www.travelodge.es/hoteles-barcelona/poblenou',
    promoCode: 'PYCONES2026BCN',
    mapsUrl: 'https://maps.app.goo.gl/xAmHRV413JHyWHUx8',
  },
  {
    name: 'Hotel Jazz',
    bookingUrl:
      'https://reservations.hoteljazz.com/hotel/nn_jazz?adultos=1&fini=06-11-2026&noches=2&origin=grponline&epc=U1RNVEhKQkdSUDFCQioqLFBZVEhPTgo=',
    promoCode: '(usar enlace directo)',
    mapsUrl: 'https://maps.app.goo.gl/ZULETA9Zp2sZW1NL9',
  },
  {
    name: 'EasyHotel Barcelona Fira',
    bookingUrl: 'https://www.easyhotel.com/es/hotels/spain/barcelona/barcelona-fira',
    promoCode: 'PYTHON',
    mapsUrl: 'https://maps.app.goo.gl/9MErH52umw4XHjFq6',
  },
]
