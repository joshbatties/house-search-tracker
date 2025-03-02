
import { ReactNode } from "react";
import Navbar from "../Navbar";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <PageTransition>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Layout;
