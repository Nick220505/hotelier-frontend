import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomStatusDemo } from "@/components/examples/room-status-components";
import { tokens } from "@/lib/design-tokens";

const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <div className="flex flex-col items-center space-y-2">
    <div
      className="w-16 h-16 rounded-lg border shadow-sm"
      style={{ backgroundColor: color }}
    />
    <div className="text-center">
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{color}</p>
    </div>
  </div>
);

const TypographyExample = () => (
  <div className="space-y-4">
    <h1 className="text-4xl font-bold text-foreground">
      Heading 1 - Welcome to Hotelier
    </h1>
    <h2 className="text-3xl font-semibold text-foreground">
      Heading 2 - Dashboard Overview
    </h2>
    <h3 className="text-2xl font-semibold text-foreground">
      Heading 3 - Room Management
    </h3>
    <h4 className="text-xl font-medium text-foreground">
      Heading 4 - Recent Bookings
    </h4>
    <p className="text-lg text-foreground">
      Large text - Important information for hotel staff
    </p>
    <p className="text-base text-foreground">
      Body text - Regular content and descriptions
    </p>
    <p className="text-sm text-muted-foreground">
      Small text - Supporting information and labels
    </p>
    <p className="text-xs text-muted-foreground">
      Extra small - Fine print and metadata
    </p>
  </div>
);

const ButtonShowcase = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">Primary</h4>
      <Button variant="default">Book Room</Button>
      <Button variant="default" size="sm">
        Check In
      </Button>
    </div>
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">Secondary</h4>
      <Button variant="secondary">View Details</Button>
      <Button variant="secondary" size="sm">
        Edit
      </Button>
    </div>
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">Outline</h4>
      <Button variant="outline">Cancel</Button>
      <Button variant="outline" size="sm">
        More
      </Button>
    </div>
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">Destructive</h4>
      <Button variant="destructive">Delete</Button>
      <Button variant="destructive" size="sm">
        Remove
      </Button>
    </div>
  </div>
);

const BadgeShowcase = () => (
  <div className="flex flex-wrap gap-2">
    <Badge className="bg-room-available text-white">Available</Badge>
    <Badge className="bg-room-occupied text-white">Occupied</Badge>
    <Badge className="bg-room-maintenance text-white">Maintenance</Badge>
    <Badge className="bg-room-cleaning text-white">Cleaning</Badge>
    <Badge className="bg-destructive text-destructive-foreground">
      Out of Order
    </Badge>
    <Badge variant="secondary">Pending</Badge>
    <Badge variant="outline">Confirmed</Badge>
  </div>
);

export default function StyleGuidePage() {
  const colorPalettes = [
    {
      name: "Brand Primary",
      description:
        "Professional hospitality blue for primary actions and branding",
      colors: tokens.colors.brand.primary,
    },
    {
      name: "Room Status",
      description: "Semantic colors for room status indicators",
      colors: tokens.colors.room,
    },
    {
      name: "Booking Status",
      description: "Colors for booking and reservation states",
      colors: tokens.colors.booking,
    },
    {
      name: "Semantic",
      description: "Standard semantic colors for UI feedback",
      colors: tokens.colors.semantic,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Hotelier Design System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive design system built for the hospitality industry,
          featuring professional colors, semantic status indicators, and
          accessible components.
        </p>
      </div>

      {/* Color Palettes */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">
          Color Palette
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {colorPalettes.map((palette) => (
            <Card key={palette.name} className="card-hover">
              <CardHeader>
                <CardTitle>{palette.name}</CardTitle>
                <CardDescription>{palette.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(palette.colors).map(([name, color]) => (
                    <ColorSwatch key={name} name={name} color={color} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">Typography</h2>
        <Card>
          <CardHeader>
            <CardTitle>Typography Scale</CardTitle>
            <CardDescription>
              Consistent text sizing for hierarchy and readability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TypographyExample />
          </CardContent>
        </Card>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">Components</h2>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Interactive elements for user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonShowcase />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges & Status Indicators</CardTitle>
            <CardDescription>
              Visual indicators for states and categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeShowcase />
          </CardContent>
        </Card>
      </section>

      {/* Hotel-Specific Components */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">
          Hotel Components
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Room Status Components</CardTitle>
            <CardDescription>
              Specialized components for hotel room management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomStatusDemo />
          </CardContent>
        </Card>
      </section>

      {/* Spacing & Layout */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">
          Spacing & Layout
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
            <CardDescription>
              8px grid system for consistent layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(tokens.spacing)
                .slice(0, 8)
                .map(([name, value]) => (
                  <div key={name} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-mono text-muted-foreground">
                      {name}
                    </div>
                    <div className="w-24 text-sm text-muted-foreground">
                      {value}
                    </div>
                    <div className="bg-primary h-4" style={{ width: value }} />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">
          Usage Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="text-success">✓ Do&apos;s</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Use semantic colors for their intended purpose</p>
              <p>• Maintain consistent spacing using the 8px grid</p>
              <p>• Test color combinations for accessibility</p>
              <p>• Use hotel status colors for room/booking states</p>
              <p>• Follow the typography hierarchy</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">✗ Don&apos;ts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Don&apos;t use destructive colors for non-error states</p>
              <p>• Don&apos;t mix different color systems</p>
              <p>• Don&apos;t use colors without sufficient contrast</p>
              <p>• Don&apos;t ignore the semantic meaning of colors</p>
              <p>• Don&apos;t create custom spacing outside the scale</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Development Notes */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">
          Development Notes
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Implementation</CardTitle>
            <CardDescription>
              How to use this design system in your code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">
                CSS Variables
              </h4>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                <code>{`/* Use CSS variables for colors */
.room-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

/* Hotel-specific status colors */
.room-available {
  background-color: hsl(var(--room-available));
}`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">
                Utility Classes
              </h4>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                <code>{`<!-- Hotel status utility classes -->
<div className="bg-room-available text-white">Available Room</div>
<div className="bg-booking-confirmed text-white">Confirmed Booking</div>

<!-- Standard semantic classes -->
<div className="status-available">Available</div>
<div className="card-hover">Hoverable Card</div>`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">
                TypeScript Utilities
              </h4>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                <code>{`import { getRoomStatusColor, HotelColors } from '@/lib/hotel-colors';

// Get colors programmatically
const roomColor = getRoomStatusColor('available');
const chartColors = HotelColors.chart;`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
