import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Chrome for the main portfolio pages. Project landing pages and courses sit outside this group and bring their own. */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
