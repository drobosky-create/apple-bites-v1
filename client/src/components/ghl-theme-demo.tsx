import React, { useState } from 'react';








import { Moon, Sun, Palette } from 'lucide-react';

export function GHLThemeDemo() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Hero Section */}
      <section className="ghl-hero-section">
        <div className="container mx-auto px-4 text-center">
          <h1 className="ghl-section-title">GHL Brand Theme Demo</h1>
          <p className="ghl-section-subtitle">
            Comprehensive GoHighLevel brand implementation with consistent styling
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={toggleTheme}
              variant="outline"
              className="ghl-outline-button"
            >
              {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Brand Colors Section */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-ghl-primary rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 className="font-heading font-semibold text-lg mb-2">Primary Teal</h3>
              <p className="text-sm text-muted-foreground">#81e5d8</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-ghl-secondary rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 className="font-heading font-semibold text-lg mb-2">Secondary Blue</h3>
              <p className="text-sm text-muted-foreground">#4493de</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-ghl-navy rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 className="font-heading font-semibold text-lg mb-2">Navy Background</h3>
              <p className="text-sm text-muted-foreground">#0b2147</p>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Button Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Primary Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button className="ghl-primary-button w-full">Primary Button</button>
                <Button className="btn-primary w-full">Enhanced Primary</Button>
              </CardContent>
            </Card>

            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Secondary Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button className="ghl-secondary-button w-full">Secondary Button</button>
                <Button className="btn-secondary w-full">Enhanced Secondary</Button>
              </CardContent>
            </Card>

            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Outline Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button className="ghl-outline-button w-full">Outline Button</button>
                <Button variant="outline" className="w-full">Standard Outline</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Components */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Form Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">GHL Form Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="form-label">Name</Label>
                  <input className="ghl-input" placeholder="Enter your name" />
                </div>
                <div>
                  <Label className="form-label">Email</Label>
                  <input className="ghl-input" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <Label className="form-label">Message</Label>
                  <textarea className="ghl-textarea" placeholder="Enter your message" rows={4} />
                </div>
                <div>
                  <Label className="form-label">Select Option</Label>
                  <select className="ghl-select">
                    <option>Choose an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Shadcn Form Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="form-label">Name</Label>
                  <Input className="form-input" placeholder="Enter your name" />
                </div>
                <div>
                  <Label className="form-label">Email</Label>
                  <Input className="form-input" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <Label className="form-label">Message</Label>
                  <Textarea className="form-input" placeholder="Enter your message" rows={4} />
                </div>
                <div>
                  <Label className="form-label">Select Option</Label>
                  <Select>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Cards */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Pricing Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="ghl-card text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-ghl-primary">$0</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Basic features</li>
                  <li>✓ 5 projects</li>
                  <li>✓ Community support</li>
                </ul>
                <Button className="ghl-primary-button w-full mt-6">Get Started</Button>
              </CardContent>
            </Card>

            <div className="ghl-pricing-card text-center">
              <h3 className="font-heading text-2xl font-bold mb-2">Growth Plan</h3>
              <div className="text-4xl font-bold text-ghl-primary mb-4">$795</div>
              <ul className="space-y-2 text-sm mb-6">
                <li>✓ Everything in Free</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ Custom integrations</li>
              </ul>
              <Button className="ghl-secondary-button w-full">Choose Plan</Button>
            </div>

            <Card className="ghl-card text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-ghl-secondary">$3495</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Growth</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ Custom solutions</li>
                  <li>✓ SLA guarantee</li>
                </ul>
                <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 ghl-outline-button w-full mt-6 text-[#3c445c]">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges and Alerts */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Badges & Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="ghl-badge">New</Badge>
                  <Badge variant="secondary">Popular</Badge>
                  <Badge variant="outline">Featured</Badge>
                  <Badge variant="destructive">Limited</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="ghl-card">
              <CardHeader>
                <CardTitle className="font-heading">Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="ghl-alert-success">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Success: Theme applied successfully!
                </div>
                <div className="ghl-alert-error">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Error: Something went wrong.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Tabs</h2>
          <Card className="ghl-card">
            <CardHeader>
              <CardTitle className="font-heading">GHL Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" className="ghl-tab-trigger">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="ghl-tab-trigger">Features</TabsTrigger>
                  <TabsTrigger value="pricing" className="ghl-tab-trigger">Pricing</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <p className="text-muted-foreground">
                    This is the overview tab content. The GHL theme provides consistent styling across all components.
                  </p>
                </TabsContent>
                <TabsContent value="features" className="mt-4">
                  <p className="text-muted-foreground">
                    Features include comprehensive brand colors, typography, and component styling.
                  </p>
                </TabsContent>
                <TabsContent value="pricing" className="mt-4">
                  <p className="text-muted-foreground">
                    Pricing is structured to match your GoHighLevel site with professional presentation.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 text-center">Typography</h2>
          <Card className="ghl-card">
            <CardHeader>
              <CardTitle className="font-heading">GHL Typography System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="font-heading text-4xl font-bold mb-2">Heading 1 - Montserrat</h1>
                <p className="font-body text-lg">Body text using Manrope for optimal readability</p>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-semibold mb-2">Heading 2 - Montserrat</h2>
                <p className="font-body">Regular body text with proper line height and spacing</p>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-medium mb-2">Heading 3 - Montserrat</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Smaller text for supporting information and descriptions
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-ghl-navy text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading font-bold text-2xl mb-4">GHL Brand Theme</h3>
          <p className="font-body text-brand-gray">
            Complete GoHighLevel brand implementation with consistent styling and theming
          </p>
        </div>
      </footer>
    </div>
  );
}