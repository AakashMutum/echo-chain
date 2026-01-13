"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Monitor, Moon, Sun, CloudRain, Trees, Cloud } from "lucide-react"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="mx-auto max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Theme Presets</Label>
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3"
              >
                <div onClick={() => setTheme("light")}>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 h-6 w-6 rounded-full bg-teal-500" />
                    Teal Blue
                  </Label>
                </div>
                <div onClick={() => setTheme("theme-purple")}>
                  <RadioGroupItem value="theme-purple" id="theme-purple" className="peer sr-only" />
                  <Label
                    htmlFor="theme-purple"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 h-6 w-6 rounded-full bg-purple-600" />
                    Electric Purple
                  </Label>
                </div>
                <div onClick={() => setTheme("theme-orange")}>
                  <RadioGroupItem value="theme-orange" id="theme-orange" className="peer sr-only" />
                  <Label
                    htmlFor="theme-orange"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 h-6 w-6 rounded-full bg-orange-500" />
                    Burnt Orange
                  </Label>
                </div>
                <div onClick={() => setTheme("theme-ice")}>
                  <RadioGroupItem value="theme-ice" id="theme-ice" className="peer sr-only" />
                  <Label
                    htmlFor="theme-ice"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 h-6 w-6 rounded-full bg-slate-400" />
                    Ice Blue
                  </Label>
                </div>
                <div onClick={() => setTheme("theme-red")}>
                  <RadioGroupItem value="theme-red" id="theme-red" className="peer sr-only" />
                  <Label
                    htmlFor="theme-red"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 h-6 w-6 rounded-full bg-red-600" />
                    Crimson Red
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>
              Adjust settings for better readability and accessibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="reduced-motion" className="flex flex-col space-y-1">
                <span>Reduced Motion</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Minimize animations and transition effects.
                </span>
              </Label>
              {/* This would be wired to a real state/context in a full implementation */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reduced-motion" className="toggle-checkbox" />
              </div>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="high-contrast" className="flex flex-col space-y-1">
                <span>High Contrast</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Increase contrast for better legibility.
                </span>
              </Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="high-contrast" className="toggle-checkbox" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
