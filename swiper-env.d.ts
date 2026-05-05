declare module "swiper/bundle" {
  // Swiper 8 bundle default export (types not exposed via package.json exports)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Swiper: any;
  export default Swiper;
}

declare module "swiper" {
  // Swiper 8 module exports (Autoplay, Navigation, etc) can fail on strict export/type resolution in CI.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Autoplay: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Navigation: any;
}
