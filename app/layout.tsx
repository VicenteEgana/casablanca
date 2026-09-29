import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Casablanca · Explora el valle",description:"Prototipo turístico del Valle de Casablanca. Rutas, mapa y audioguías.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>}