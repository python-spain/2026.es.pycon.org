export interface IHotel {
  name: string
  bookingUrl: string
  /** Omit when discount is applied via the booking URL only. */
  promoCode?: string
  mapsUrl: string
}
