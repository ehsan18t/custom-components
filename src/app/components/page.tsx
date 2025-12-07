"use client";

import { useState } from "react";
import { useTheme } from "@/context";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarGroup,
  Skeleton,
  SkeletonCard,
  Modal,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Tooltip,
  useToast,
} from "@/components/ui";
import { useAnimateOnMount } from "@/hooks";

export default function ComponentsPage() {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  // Animate the page container on mount
  const containerRef = useAnimateOnMount<HTMLDivElement>({
    type: "fadeInUp",
    duration: 0.6,
  });

  return (
    <div ref={containerRef} className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Custom Components</h1>
        <p className="text-muted-foreground text-lg mb-6">
          A collection of animated, themeable components built with TailwindCSS v4, GSAP, and TypeScript.
        </p>

        {/* Theme Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Theme: {resolvedTheme}</span>
          <Button onClick={toggleTheme} variant="outline" size="sm">
            Toggle Theme
          </Button>
          <Dropdown>
            <DropdownTrigger>Select Theme</DropdownTrigger>
            <DropdownContent>
              <DropdownLabel>Theme</DropdownLabel>
              <DropdownSeparator />
              <DropdownItem onSelect={() => setTheme("light")}>Light</DropdownItem>
              <DropdownItem onSelect={() => setTheme("dark")}>Dark</DropdownItem>
              <DropdownItem onSelect={() => setTheme("system")}>System</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </header>

      {/* Components Grid */}
      <div className="space-y-16">
        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button isLoading loadingText="Loading...">
              Submit
            </Button>
            <Button disabled>Disabled</Button>
            <Button rounded="full">Rounded Full</Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input
              label="Default Input"
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="With Helper Text"
              placeholder="Your email"
              helperText="We'll never share your email."
              type="email"
            />
            <Input
              label="Error State"
              placeholder="Invalid input"
              error="This field is required"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
            />
            <Input
              label="Filled Variant"
              variant="filled"
              placeholder="Filled style"
            />
            <Input
              label="Flushed Variant"
              variant="flushed"
              placeholder="Flushed style"
            />
          </div>
        </section>

        {/* Textarea Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Textarea</h2>
          <div className="max-w-md">
            <Textarea
              label="Message"
              placeholder="Type your message..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              showCount
              maxLength={200}
              helperText="Max 200 characters"
            />
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card animated>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>With hover animation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card has a subtle lift animation on hover.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>With shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card has elevated shadow styling.
                </p>
              </CardContent>
            </Card>

            <Card variant="filled">
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>Muted background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card has a filled background style.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Badges</h2>
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
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
            <Badge dot>With Dot</Badge>
            <Badge removable onRemove={() => addToast({ title: "Badge removed!" })}>
              Removable
            </Badge>
          </div>
        </section>

        {/* Avatars Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Avatars</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar
              src="https://i.pravatar.cc/150?img=1"
              name="John Doe"
              size="xs"
            />
            <Avatar
              src="https://i.pravatar.cc/150?img=2"
              name="Jane Smith"
              size="sm"
            />
            <Avatar
              src="https://i.pravatar.cc/150?img=3"
              name="Bob Wilson"
              size="md"
            />
            <Avatar
              src="https://i.pravatar.cc/150?img=4"
              name="Alice Brown"
              size="lg"
            />
            <Avatar
              src="https://i.pravatar.cc/150?img=5"
              name="Charlie Davis"
              size="xl"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Avatar name="John Doe" size="md" />
            <Avatar name="Jane Smith" size="md" showStatus statusColor="online" />
            <Avatar name="Bob Wilson" size="md" showStatus statusColor="busy" />
            <Avatar name="Away User" size="md" showStatus statusColor="away" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Avatar Group:</p>
            <AvatarGroup max={4}>
              <Avatar src="https://i.pravatar.cc/150?img=1" name="User 1" />
              <Avatar src="https://i.pravatar.cc/150?img=2" name="User 2" />
              <Avatar src="https://i.pravatar.cc/150?img=3" name="User 3" />
              <Avatar src="https://i.pravatar.cc/150?img=4" name="User 4" />
              <Avatar src="https://i.pravatar.cc/150?img=5" name="User 5" />
              <Avatar src="https://i.pravatar.cc/150?img=6" name="User 6" />
            </AvatarGroup>
          </div>
        </section>

        {/* Skeleton Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Skeletons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton width="100%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="60%" height={20} />
              <Skeleton variant="circular" width={60} height={60} />
            </div>
            <SkeletonCard showImage />
          </div>
        </section>

        {/* Tooltip Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Tooltips</h2>
          <div className="flex flex-wrap gap-4">
            <Tooltip content="Tooltip on top" side="top">
              <Button variant="outline">Top</Button>
            </Tooltip>
            <Tooltip content="Tooltip on bottom" side="bottom">
              <Button variant="outline">Bottom</Button>
            </Tooltip>
            <Tooltip content="Tooltip on left" side="left">
              <Button variant="outline">Left</Button>
            </Tooltip>
            <Tooltip content="Tooltip on right" side="right">
              <Button variant="outline">Right</Button>
            </Tooltip>
          </div>
        </section>

        {/* Dropdown Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Dropdown</h2>
          <Dropdown>
            <DropdownTrigger>Actions</DropdownTrigger>
            <DropdownContent>
              <DropdownLabel>Actions</DropdownLabel>
              <DropdownSeparator />
              <DropdownItem onSelect={() => addToast({ title: "Edit clicked" })}>
                Edit
              </DropdownItem>
              <DropdownItem onSelect={() => addToast({ title: "Duplicate clicked" })}>
                Duplicate
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                onSelect={() => addToast({ title: "Delete clicked", variant: "destructive" })}
              >
                Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </section>

        {/* Modal Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            description="This is a modal with GSAP animations."
            footer={
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            <p className="text-muted-foreground">
              Modal content goes here. You can put any content inside the modal body.
              The modal supports keyboard navigation (Escape to close) and click outside to close.
            </p>
          </Modal>
        </section>

        {/* Toast Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() =>
                addToast({
                  title: "Default Toast",
                  description: "This is a default notification.",
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
                })
              }
            >
              Error
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
                  description: "Here's some helpful information.",
                  variant: "info",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo clicked"),
                  },
                })
              }
            >
              With Action
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border text-center text-muted-foreground">
        <p>Built with Next.js, TailwindCSS v4, GSAP & TypeScript</p>
      </footer>
    </div>
  );
}
