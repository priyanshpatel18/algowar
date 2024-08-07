import localFont from "next/font/local"

const algowar = localFont({
  src: "./algowar.ttf"
})
const montserrat = localFont({
  src: "./Montserrat.ttf"
})
const poppins = localFont({
  src: "./Montserrat.ttf"
})

export const logoFont = algowar.className;
// export const globalFont = montserrat.className;
export const globalFont = poppins.className;