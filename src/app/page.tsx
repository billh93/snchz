import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { ToolsSection } from "@/components/sections/tools";
import { StackSection } from "@/components/sections/stack";
import { FooterSection } from "@/components/sections/footer";
import { Nav } from "@/components/nav";

const FlowField = dynamic(() =>
  import("@/components/flow-field").then((m) => m.FlowField)
);

export default function Home() {
  return (
    <>
      <FlowField />
      <Nav />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ToolsSection />
        <StackSection />
        <FooterSection />
      </main>
    </>
  );
}
