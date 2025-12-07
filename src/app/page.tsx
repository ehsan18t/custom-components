"use client";

import { ArrowRight, Code2, Palette, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useTheme } from "@/context";
import { useAnimateOnMount, useScrollTrigger } from "@/hooks";

// ============================================================================
// Feature Card
// ============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const ref = useScrollTrigger<HTMLDivElement>({
    type: "fadeInUp",
    duration: 0.5,
  });

  return (
    <Card ref={ref} animated hoverScale={1.02} hoverLift={4}>
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function Home() {
  const { toggleTheme, resolvedTheme } = useTheme();

  const heroRef = useAnimateOnMount<HTMLDivElement>({
    type: "fadeInUp",
    duration: 0.6,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div ref={heroRef} className="text-center">
            {/* Badges */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              <Badge variant="primary" size="sm">
                <Sparkles className="mr-1 h-3 w-3" />
                v1.0
              </Badge>
              <Badge variant="outline" size="sm">
                Next.js 16
              </Badge>
              <Badge variant="outline" size="sm">
                TailwindCSS v4
              </Badge>
              <Badge variant="outline" size="sm">
                GSAP
              </Badge>
            </div>

            {/* Title */}
            <h1 className="mx-auto max-w-4xl font-bold text-4xl tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">Beautiful Components</span>
              <span className="mt-2 block bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Built for Delight
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
              A premium collection of animated, accessible React components. Built with GSAP
              animations, theme support, and TypeScript. Not just another component library.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                preset="playful"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                <Link href="/components">View Components</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={toggleTheme}>
                {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-border border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Why Custom Components?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build stunning interfaces
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Zap}
              title="GSAP Animations"
              description="Smooth, performant animations with multiple presets. Hover, click, and focus effects that feel natural."
            />
            <FeatureCard
              icon={Palette}
              title="Themeable"
              description="Dark mode, light mode, and system preference support. CSS variables with oklch colors for vibrant themes."
            />
            <FeatureCard
              icon={Code2}
              title="TypeScript First"
              description="Full type safety with exported prop interfaces. Autocomplete and documentation in your IDE."
            />
            <FeatureCard
              icon={Sparkles}
              title="Accessible"
              description="WCAG compliant with proper ARIA attributes. Keyboard navigation, focus trapping, and reduced motion support."
            />
          </div>
        </div>
      </section>

      {/* Component Preview Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Component Showcase</h2>
            <p className="mt-4 text-lg text-muted-foreground">A glimpse of what's included</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Button Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>8 variants, 5 sizes, animation presets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" preset="playful">
                    Primary
                  </Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ghost
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Input Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Clearable, prefix/suffix, icons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <code className="rounded bg-muted px-2 py-1">clearable</code>
                  <code className="rounded bg-muted px-2 py-1">prefix="$"</code>
                  <code className="rounded bg-muted px-2 py-1">suffix=".com"</code>
                </div>
              </CardContent>
            </Card>

            {/* Toast Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Toasts</CardTitle>
                <CardDescription>Progress bar, pause on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <code className="rounded bg-muted px-2 py-1">showProgress</code>
                  <code className="rounded bg-muted px-2 py-1">pauseOnHover</code>
                  <code className="rounded bg-muted px-2 py-1">action buttons</code>
                </div>
              </CardContent>
            </Card>

            {/* Modal Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Modal</CardTitle>
                <CardDescription>Focus trap, GSAP animations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <code className="rounded bg-muted px-2 py-1">focus trapping</code>
                  <code className="rounded bg-muted px-2 py-1">keyboard navigation</code>
                </div>
              </CardContent>
            </Card>

            {/* Tooltip Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Tooltips</CardTitle>
                <CardDescription>Portal rendering, positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <code className="rounded bg-muted px-2 py-1">usePortal</code>
                  <code className="rounded bg-muted px-2 py-1">showArrow</code>
                  <code className="rounded bg-muted px-2 py-1">4 positions</code>
                </div>
              </CardContent>
            </Card>

            {/* Textarea Preview */}
            <Card animated>
              <CardHeader>
                <CardTitle>Textarea</CardTitle>
                <CardDescription>Auto-resize, character count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <code className="rounded bg-muted px-2 py-1">autoResize</code>
                  <code className="rounded bg-muted px-2 py-1">showCount</code>
                  <code className="rounded bg-muted px-2 py-1">minRows/maxRows</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              <Link href="/components">Explore All Components</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Custom Components</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Built with Next.js 16, TailwindCSS v4, GSAP & TypeScript
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" size="sm">
                React 19
              </Badge>
              <Badge variant="outline" size="sm">
                Accessible
              </Badge>
              <Badge variant="outline" size="sm">
                Animated
              </Badge>
              <Badge variant="outline" size="sm">
                Themeable
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
