"use client";

import {
  Bell,
  ChevronRight,
  Download,
  ExternalLink,
  Heart,
  Mail,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { AnimationProvider } from "@/context";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="border-border border-b pb-2 font-semibold text-foreground text-xl">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

function DemoContent() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-2 text-center">
          <h1 className="font-bold text-4xl text-foreground">Button Component Demo</h1>
          <p className="text-muted-foreground">
            Comprehensive button variants with animation presets
          </p>
        </header>

        {/* Variants */}
        <Section title="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </Section>

        {/* Icon Buttons */}
        <Section title="Icon Buttons">
          <Button iconOnly iconSize="xs">
            <Plus />
          </Button>
          <Button iconOnly iconSize="sm">
            <Heart />
          </Button>
          <Button iconOnly iconSize="md">
            <Settings />
          </Button>
          <Button iconOnly iconSize="lg">
            <Bell />
          </Button>
          <Button iconOnly iconSize="xl" variant="outline">
            <Search />
          </Button>
          <Button iconOnly rounded="full">
            <Mail />
          </Button>
          <Button iconOnly rounded="full" variant="destructive">
            <Trash2 />
          </Button>
        </Section>

        {/* With Icons */}
        <Section title="With Icons">
          <Button leftIcon={<Send />}>Send Message</Button>
          <Button rightIcon={<ChevronRight />}>Continue</Button>
          <Button leftIcon={<Download />} rightIcon={<ExternalLink />}>
            Download PDF
          </Button>
          <Button variant="outline" leftIcon={<Settings />}>
            Settings
          </Button>
          <Button variant="destructive" leftIcon={<Trash2 />}>
            Delete
          </Button>
        </Section>

        {/* Loading States */}
        <Section title="Loading States">
          <Button isLoading>Loading...</Button>
          <Button isLoading loadingText="Saving...">
            Save
          </Button>
          <Button isLoading spinnerPlacement="end" loadingText="Processing">
            Submit
          </Button>
          <Button isLoading variant="outline" loadingText="Please wait..." />
        </Section>

        {/* Rounded Variants */}
        <Section title="Rounded Variants">
          <Button rounded="none">None</Button>
          <Button rounded="sm">Small</Button>
          <Button rounded="default">Default</Button>
          <Button rounded="lg">Large</Button>
          <Button rounded="xl">Extra Large</Button>
          <Button rounded="full">Full</Button>
        </Section>

        {/* Animation Presets */}
        <Section title="Animation Presets">
          <Button preset="subtle" hoverEffect="scale">
            Subtle (Scale)
          </Button>
          <Button preset="playful" hoverEffect="lift">
            Playful (Lift)
          </Button>
          <Button preset="material" clickEffect="ripple">
            Material (Ripple)
          </Button>
          <Button hoverEffect="glow" variant="outline">
            Glow
          </Button>
          <Button hoverEffect="shine">Shine</Button>
          <Button preset="minimal" animated={false}>
            No Animation
          </Button>
        </Section>

        {/* Click Effects */}
        <Section title="Click Effects">
          <Button clickEffect="ripple">Ripple</Button>
          <Button clickEffect="pulse" variant="secondary">
            Pulse
          </Button>
          <Button clickEffect="bounce" variant="success">
            Bounce
          </Button>
          <Button clickEffect="press" variant="outline">
            Press
          </Button>
        </Section>

        {/* Focus Effects */}
        <Section title="Focus Effects (Tab to see)">
          <Button focusEffect="ring">Ring Focus</Button>
          <Button focusEffect="glow" variant="outline">
            Glow Focus
          </Button>
          <Button focusEffect="outline" variant="ghost">
            Outline Focus
          </Button>
        </Section>

        {/* Full Width */}
        <section className="space-y-4">
          <h2 className="border-border border-b pb-2 font-semibold text-foreground text-xl">
            Full Width
          </h2>
          <Button fullWidth leftIcon={<Mail />}>
            Full Width Button
          </Button>
          <Button fullWidth variant="outline" leftIcon={<Download />}>
            Download All Files
          </Button>
        </section>

        {/* Disabled States */}
        <Section title="Disabled States">
          <Button disabled>Primary Disabled</Button>
          <Button disabled variant="outline">
            Outline Disabled
          </Button>
          <Button disabled variant="ghost">
            Ghost Disabled
          </Button>
        </Section>

        {/* Polymorphic (asChild) */}
        <Section title="Polymorphic (asChild)">
          <Button asChild variant="outline">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub Link
            </a>
          </Button>
          <Button asChild variant="link">
            <a href="#top">Back to Top</a>
          </Button>
        </Section>

        {/* Custom Animation Values */}
        <Section title="Custom Animation Values">
          <Button hoverScale={1.1} hoverEffect="scale">
            Scale 1.1x
          </Button>
          <Button hoverScale={1.15} pressScale={0.9} hoverEffect="scale" clickEffect="press">
            Custom Scales
          </Button>
          <Button duration="slow" hoverEffect="lift">
            Slow Animation
          </Button>
          <Button duration="fast" hoverEffect="lift">
            Fast Animation
          </Button>
          <Button easing="bounce" hoverEffect="scale">
            Bouncy
          </Button>
        </Section>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AnimationProvider>
      <DemoContent />
    </AnimationProvider>
  );
}
