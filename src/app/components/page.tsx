"use client";

import {
  Bell,
  Check,
  CreditCard,
  Download,
  Heart,
  Mail,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Input,
  Modal,
  Skeleton,
  SkeletonCard,
  Textarea,
  Tooltip,
  useToast,
} from "@/components/ui";
import { useTheme } from "@/context";
import { useAnimateOnMount, useScrollTrigger } from "@/hooks";

// ============================================================================
// Section Component
// ============================================================================

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const sectionRef = useScrollTrigger<HTMLElement>({
    type: "fadeInUp",
    duration: 0.5,
  });

  return (
    <section ref={sectionRef} className="scroll-mt-20" id={title.toLowerCase().replace(/\s/g, "-")}>
      <div className="mb-8">
        <h2 className="mb-2 font-bold text-2xl tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// ============================================================================
// Demo Component Groups
// ============================================================================

function DemoGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function ComponentsPage() {
  const { setTheme, resolvedTheme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [clearableValue, setClearableValue] = useState("Clear me!");
  const [textareaValue, setTextareaValue] = useState("");
  const [autoResizeValue, setAutoResizeValue] = useState("");

  // Animate the page container on mount
  const containerRef = useAnimateOnMount<HTMLDivElement>({
    type: "fadeInUp",
    duration: 0.6,
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-border border-b bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
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
              </div>
              <h1 className="mb-4 font-bold text-4xl tracking-tight lg:text-5xl">
                Custom Components
              </h1>
              <p className="text-lg text-muted-foreground lg:text-xl">
                A premium collection of animated, accessible components built with GSAP animations,
                theme support, and TypeScript. Not just another component library.
              </p>
            </div>

            {/* Theme Controls */}
            <div className="flex flex-col gap-4">
              <Card className="backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm">Theme: {resolvedTheme}</span>
                    <Button
                      onClick={toggleTheme}
                      variant="outline"
                      size="sm"
                      preset="playful"
                      leftIcon={<Zap className="h-4 w-4" />}
                    >
                      Toggle
                    </Button>
                    <Dropdown>
                      <DropdownTrigger
                        className="flex items-center justify-center"
                        asChild
                        showChevron={false}
                      >
                        <Button variant="ghost" size="sm" iconOnly>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownContent>
                        <DropdownLabel>Theme</DropdownLabel>
                        <DropdownSeparator />
                        <DropdownItem onSelect={() => setTheme("light")}>Light</DropdownItem>
                        <DropdownItem onSelect={() => setTheme("dark")}>Dark</DropdownItem>
                        <DropdownItem onSelect={() => setTheme("system")}>System</DropdownItem>
                      </DropdownContent>
                    </Dropdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-border border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
          <div className="flex gap-6 py-4">
            {[
              "Buttons",
              "Inputs",
              "Textarea",
              "Cards",
              "Badges",
              "Avatars",
              "Tooltips",
              "Dropdown",
              "Modal",
              "Toasts",
              "Skeletons",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="whitespace-nowrap text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-24 px-6 py-16 lg:px-8">
        {/* ================================================================ */}
        {/* BUTTONS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Buttons"
          description="Animated buttons with multiple variants, sizes, and GSAP animation presets."
        >
          <DemoGroup title="Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" leftIcon={<Star className="h-4 w-4" />}>
                Primary
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
                Destructive
              </Button>
              <Button variant="success" leftIcon={<Check className="h-4 w-4" />}>
                Success
              </Button>
              <Button clickEffect="ripple" hoverEffect="magnetic" variant="warning">
                Warning
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </DemoGroup>

          <DemoGroup title="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </DemoGroup>

          <DemoGroup title="Animation Presets">
            <div className="flex flex-wrap gap-3">
              <Button preset="subtle" variant="outline">
                Subtle
              </Button>
              <Button preset="playful" variant="primary">
                Playful ✨
              </Button>
              <Button preset="material" variant="secondary">
                Material
              </Button>
              <Button preset="minimal" variant="ghost">
                Minimal
              </Button>
              <Button preset="none" variant="outline">
                No Animation
              </Button>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              💡 Hover and click each button to see different animation effects!
            </p>
          </DemoGroup>

          <DemoGroup title="Icons & States">
            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<Mail className="h-4 w-4" />}>With Left Icon</Button>
              <Button rightIcon={<Send className="h-4 w-4" />}>With Right Icon</Button>
              <Button iconOnly size="md" aria-label="Add item">
                <Plus className="h-4 w-4" />
              </Button>
              <Button iconOnly size="md" rounded="full" aria-label="Like">
                <Heart className="h-4 w-4" />
              </Button>
              <Button isLoading loadingText="Saving...">
                Save
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </DemoGroup>

          <DemoGroup title="Rounded Variants">
            <div className="flex flex-wrap gap-3">
              <Button rounded="none">Square</Button>
              <Button rounded="sm">Small Radius</Button>
              <Button>Medium Radius</Button>
              <Button rounded="lg">Large Radius</Button>
              <Button rounded="full">Pill Shape</Button>
            </div>
          </DemoGroup>
        </Section>

        {/* ================================================================ */}
        {/* INPUTS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Inputs"
          description="Beautiful inputs with subtle shadows, clearable functionality, prefix/suffix support, and smooth focus states."
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <DemoGroup title="Basic Variants">
              <div className="space-y-4">
                <Input
                  label="Default Input"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInputValue(e.target.value)
                  }
                />
                <Input label="Filled Variant" variant="filled" placeholder="Filled style" />
                <Input label="Flushed Variant" variant="flushed" placeholder="Flushed style" />
              </div>
            </DemoGroup>

            <DemoGroup title="Clearable Input">
              <div className="space-y-4">
                <Input
                  label="Clearable"
                  placeholder="Type something..."
                  value={clearableValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setClearableValue(e.target.value)
                  }
                  clearable
                  onClear={() => setClearableValue("")}
                  helperText="Click the X button to clear"
                />
                <Input
                  label="Password with Toggle"
                  type="password"
                  placeholder="Enter password"
                  helperText="Click the eye icon to reveal"
                />
              </div>
            </DemoGroup>

            <DemoGroup title="Prefix & Suffix">
              <div className="space-y-4">
                <Input label="Price" prefix="$" placeholder="0.00" type="number" />
                <Input label="Website" suffix=".com" placeholder="yoursite" />
                <Input
                  label="Email"
                  prefix="@"
                  suffix=".email"
                  placeholder="username"
                  helperText="With both prefix and suffix"
                />
              </div>
            </DemoGroup>

            <DemoGroup title="With Icons">
              <div className="space-y-4">
                <Input
                  label="Search"
                  leftIcon={<Search className="h-4 w-4" />}
                  placeholder="Search anything..."
                  clearable
                />
                <Input
                  label="Credit Card"
                  leftIcon={<CreditCard className="h-4 w-4" />}
                  placeholder="0000 0000 0000 0000"
                />
                <Input
                  label="Download"
                  rightIcon={<Download className="h-4 w-4" />}
                  placeholder="Enter URL..."
                />
              </div>
            </DemoGroup>

            <DemoGroup title="States">
              <div className="space-y-4">
                <Input
                  label="Error State"
                  state="error"
                  placeholder="Invalid input"
                  error="This field is required"
                />
                <Input
                  label="Success State"
                  state="success"
                  placeholder="Valid input"
                  defaultValue="correct@email.com"
                  helperText="Email is valid!"
                />
                <Input
                  label="Warning State"
                  state="warning"
                  placeholder="Check input"
                  defaultValue="weak password"
                  helperText="Password strength: weak"
                />
              </div>
            </DemoGroup>

            <DemoGroup title="Sizes & Variants">
              <div className="space-y-4">
                <Input inputSize="sm" label="Small Input" placeholder="Small size" />
                <Input inputSize="md" label="Medium Input" placeholder="Medium size (default)" />
                <Input inputSize="lg" label="Large Input" placeholder="Large size" />
                <Input
                  label="Ghost Variant"
                  variant="ghost"
                  placeholder="Ghost style input"
                  helperText="Minimal styling until focused"
                />
              </div>
            </DemoGroup>
          </div>
        </Section>

        {/* ================================================================ */}
        {/* TEXTAREA SECTION */}
        {/* ================================================================ */}
        <Section
          title="Textarea"
          description="Feature-rich textarea with auto-resize, character count, and validation states."
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <DemoGroup title="Basic">
              <Textarea
                label="Message"
                placeholder="Type your message..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                showCount
                maxLength={200}
                helperText="Max 200 characters"
              />
            </DemoGroup>

            <DemoGroup title="Auto-Resize">
              <Textarea
                label="Auto-expanding Textarea"
                placeholder="Start typing... the textarea will grow!"
                value={autoResizeValue}
                onChange={(e) => setAutoResizeValue(e.target.value)}
                autoResize
                minRows={2}
                maxRows={8}
                helperText="Grows from 2 to 8 rows automatically"
              />
            </DemoGroup>

            <DemoGroup title="Variants">
              <div className="space-y-4">
                <Textarea variant="default" placeholder="Default variant" rows={2} />
                <Textarea variant="filled" placeholder="Filled variant" rows={2} />
                <Textarea variant="flushed" placeholder="Flushed variant" rows={2} />
              </div>
            </DemoGroup>

            <DemoGroup title="States">
              <div className="space-y-4">
                <Textarea state="error" placeholder="Error state" error="Please enter a message" />
                <Textarea
                  state="success"
                  placeholder="Success state"
                  defaultValue="Valid content"
                />
              </div>
            </DemoGroup>
          </div>
        </Section>

        {/* ================================================================ */}
        {/* CARDS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Cards"
          description="Flexible card components with hover animations, glass morphism, 3D tilt, spotlight effects, and multiple variants."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Glass morphism card */}
            <Card variant="glass" animated spotlight>
              <CardHeader>
                <CardTitle>Glass Morphism</CardTitle>
                <CardDescription>Frosted glass with spotlight</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beautiful frosted glass effect with mouse-tracking spotlight.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* 3D Tilt card */}
            <Card tilt tiltIntensity={15} glow variant="elevated">
              <CardHeader>
                <CardTitle>3D Tilt Effect</CardTitle>
                <CardDescription>Move your mouse around</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card tilts in 3D space following your cursor with glow effect.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Gradient border card */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Gradient Border</CardTitle>
                <CardDescription>Animated gradient edge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Eye-catching gradient border that wraps around the card.
                </p>
              </CardContent>
              <CardFooter>
                <Badge variant="success">New</Badge>
              </CardFooter>
            </Card>

            {/* Combined effects card */}
            <Card animated tilt spotlight hoverLift={12} variant="default">
              <CardHeader>
                <CardTitle>All Effects Combined</CardTitle>
                <CardDescription>Tilt + Spotlight + Lift</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience all effects working together harmoniously.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="ghost">
                  Explore
                </Button>
              </CardFooter>
            </Card>

            {/* Glow effect card */}
            <Card glow glowColor="rgba(147, 51, 234, 0.5)" animated variant="filled">
              <CardHeader>
                <CardTitle>Custom Glow</CardTitle>
                <CardDescription>Purple glow on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cards can have custom colored glow effects on hover.
                </p>
              </CardContent>
            </Card>

            {/* Simple variants */}
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline Variant</CardTitle>
                <CardDescription>Simple border style</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A clean, minimal card with just an outline.</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ================================================================ */}
        {/* BADGES SECTION */}
        {/* ================================================================ */}
        <Section
          title="Badges"
          description="Status indicators with variants, sizes, and interactive features."
        >
          <DemoGroup title="Variants">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
          </DemoGroup>

          <DemoGroup title="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </DemoGroup>

          <DemoGroup title="With Icons & Features">
            <div className="flex flex-wrap gap-3">
              <Badge dot variant="success">
                Online
              </Badge>
              <Badge dot dotColor="warning">
                Away
              </Badge>
              <Badge dot dotColor="destructive">
                Busy
              </Badge>
              <Badge
                removable
                onRemove={() => addToast({ title: "Badge removed!", variant: "info" })}
              >
                Removable
              </Badge>
              <Badge variant="primary">
                <Bell className="mr-1 h-3 w-3" />
                Notifications
              </Badge>
              <Badge variant="success">
                <Check className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </DemoGroup>
        </Section>

        {/* ================================================================ */}
        {/* AVATARS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Avatars"
          description="User avatars with fallbacks, status indicators, and grouping."
        >
          <DemoGroup title="Sizes">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar src="https://i.pravatar.cc/150?img=1" name="John Doe" size="xs" />
              <Avatar src="https://i.pravatar.cc/150?img=2" name="Jane Smith" size="sm" />
              <Avatar src="https://i.pravatar.cc/150?img=3" name="Bob Wilson" size="md" />
              <Avatar src="https://i.pravatar.cc/150?img=4" name="Alice Brown" size="lg" />
              <Avatar src="https://i.pravatar.cc/150?img=5" name="Charlie Davis" size="xl" />
            </div>
          </DemoGroup>

          <DemoGroup title="Fallback & Status">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="John Doe" size="md" />
              <Avatar name="Jane Smith" size="md" showStatus statusColor="online" />
              <Avatar name="Bob Wilson" size="md" showStatus statusColor="busy" />
              <Avatar name="Away User" size="md" showStatus statusColor="away" />
              <Avatar name="Offline" size="md" showStatus statusColor="offline" />
            </div>
          </DemoGroup>

          <DemoGroup title="Avatar Group">
            <div className="flex flex-col gap-4">
              <AvatarGroup max={4} size="md">
                <Avatar src="https://i.pravatar.cc/150?img=1" name="User 1" />
                <Avatar src="https://i.pravatar.cc/150?img=2" name="User 2" />
                <Avatar src="https://i.pravatar.cc/150?img=3" name="User 3" />
                <Avatar src="https://i.pravatar.cc/150?img=4" name="User 4" />
                <Avatar src="https://i.pravatar.cc/150?img=5" name="User 5" />
                <Avatar src="https://i.pravatar.cc/150?img=6" name="User 6" />
              </AvatarGroup>
              <AvatarGroup max={3} size="lg">
                <Avatar src="https://i.pravatar.cc/150?img=10" name="Alice" />
                <Avatar src="https://i.pravatar.cc/150?img=11" name="Bob" />
                <Avatar src="https://i.pravatar.cc/150?img=12" name="Charlie" />
                <Avatar src="https://i.pravatar.cc/150?img=13" name="Diana" />
                <Avatar src="https://i.pravatar.cc/150?img=14" name="Eve" />
              </AvatarGroup>
            </div>
          </DemoGroup>
        </Section>

        {/* ================================================================ */}
        {/* TOOLTIPS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Tooltips"
          description="Accessible tooltips with arrow, portal rendering, and positioning options."
        >
          <DemoGroup title="Positions">
            <div className="flex flex-wrap gap-4">
              <Tooltip content="I'm on top!" side="top" showArrow>
                <Button variant="outline">Top</Button>
              </Tooltip>
              <Tooltip content="I'm on the bottom!" side="bottom" showArrow>
                <Button variant="outline">Bottom</Button>
              </Tooltip>
              <Tooltip content="I'm on the left!" side="left" showArrow>
                <Button variant="outline">Left</Button>
              </Tooltip>
              <Tooltip content="I'm on the right!" side="right" showArrow>
                <Button variant="outline">Right</Button>
              </Tooltip>
            </div>
          </DemoGroup>

          <DemoGroup title="Rich Content">
            <div className="flex flex-wrap gap-4">
              <Tooltip
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold">Pro Tip!</p>
                    <p className="text-xs opacity-80">
                      Tooltips can contain rich content with formatting.
                    </p>
                  </div>
                }
                side="top"
              >
                <Button variant="secondary">Rich Content</Button>
              </Tooltip>
              <Tooltip content="With custom delay" side="top" delay={500}>
                <Button variant="ghost">500ms Delay</Button>
              </Tooltip>
            </div>
          </DemoGroup>

          <DemoGroup title="Portal Rendering">
            <div className="flex gap-4 overflow-hidden rounded-lg border border-border p-4">
              <Tooltip content="I might get clipped!" side="top" showArrow>
                <Button variant="outline" size="sm">
                  No Portal
                </Button>
              </Tooltip>
              <Tooltip content="I escape the container!" side="top" showArrow usePortal>
                <Button variant="primary" size="sm">
                  With Portal
                </Button>
              </Tooltip>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">
              💡 The portal tooltip renders outside the overflow:hidden container
            </p>
          </DemoGroup>
        </Section>

        {/* ================================================================ */}
        {/* DROPDOWN SECTION */}
        {/* ================================================================ */}
        <Section
          title="Dropdown"
          description="Accessible dropdown menus with GSAP enter/exit animations."
        >
          <div className="flex flex-wrap gap-4">
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline" rightIcon={<Settings className="h-4 w-4" />}>
                  Actions
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>Actions</DropdownLabel>
                <DropdownSeparator />
                <DropdownItem onSelect={() => addToast({ title: "Edit clicked" })}>
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Edit
                  </span>
                </DropdownItem>
                <DropdownItem onSelect={() => addToast({ title: "Duplicate clicked" })}>
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Duplicate
                  </span>
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  onSelect={() => addToast({ title: "Delete clicked", variant: "destructive" })}
                >
                  <span className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </span>
                </DropdownItem>
              </DropdownContent>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger asChild>
                <Button leftIcon={<User className="h-4 w-4" />}>Account</Button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownLabel>My Account</DropdownLabel>
                <DropdownSeparator />
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Billing</DropdownItem>
                <DropdownSeparator />
                <DropdownItem>Sign out</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </Section>

        {/* ================================================================ */}
        {/* MODAL SECTION */}
        {/* ================================================================ */}
        <Section
          title="Modal"
          description="Accessible modal dialogs with focus trapping and GSAP animations."
        >
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              With Focus Trap
            </Button>
          </div>

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            description="This modal has focus trapping and GSAP animations."
            footer={
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    addToast({ title: "Confirmed!", variant: "success" });
                  }}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Try pressing <kbd className="rounded bg-muted px-1.5 py-0.5 text-sm">Tab</kbd> to
                cycle through focusable elements. Focus is trapped within the modal.
              </p>
              <Input label="Example Input" placeholder="Type here..." />
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Button 1
                </Button>
                <Button size="sm" variant="outline">
                  Button 2
                </Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* ================================================================ */}
        {/* TOASTS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Toasts"
          description="Toast notifications with progress bar, pause on hover, and action buttons."
        >
          <div className="mb-4 rounded-lg border border-info/20 bg-info/10 p-4">
            <p className="text-info-foreground text-sm">
              ✨ <strong>Progress Bar Enabled!</strong> Watch the progress bar countdown on each
              toast. Hover to pause!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                addToast({
                  title: "Default Toast",
                  description: "This is a default notification with progress bar.",
                })
              }
            >
              Default
            </Button>
            <Button
              variant="success"
              onClick={() =>
                addToast({
                  title: "Success!",
                  description: "Operation completed successfully.",
                  variant: "success",
                })
              }
            >
              Success
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                addToast({
                  title: "Error!",
                  description: "Something went wrong.",
                  variant: "destructive",
                  duration: 8000,
                })
              }
            >
              Error (8s)
            </Button>
            <Button
              variant="warning"
              onClick={() =>
                addToast({
                  title: "Warning!",
                  description: "Please check your input.",
                  variant: "warning",
                })
              }
            >
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                addToast({
                  title: "Info",
                  description: "Here's some helpful information. Hover me to pause!",
                  variant: "info",
                  action: {
                    label: "Undo",
                    onClick: () => addToast({ title: "Undone!", variant: "success" }),
                  },
                })
              }
            >
              With Action
            </Button>
          </div>
        </Section>

        {/* ================================================================ */}
        {/* SKELETONS SECTION */}
        {/* ================================================================ */}
        <Section
          title="Skeletons"
          description="Loading placeholders with wave animation and reduced motion support."
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <DemoGroup title="Basic Shapes">
              <div className="space-y-4">
                <Skeleton width="100%" height={20} />
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={20} />
                <div className="flex gap-4">
                  <Skeleton variant="circular" width={48} height={48} />
                  <Skeleton variant="circular" width={48} height={48} />
                  <Skeleton variant="circular" width={48} height={48} />
                </div>
              </div>
            </DemoGroup>

            <DemoGroup title="Skeleton Card">
              <SkeletonCard showImage />
            </DemoGroup>
          </div>
        </Section>
      </main>

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
