import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { Loader2 } from "lucide-react";
import {
  Satellite,
  Leaf,
  BarChart3,
  Cloud,
  Droplets,
  Zap,
  ChevronDown,
  Menu,
  X,
  Check,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Sprout,
  TrendingUp,
  Clock,
  Users,
  Star,
  Play,
} from "lucide-react";
import { SiLinkedin, SiX, SiFacebook, SiInstagram } from "react-icons/si";
import logoImage from "@assets/WhatsApp_Image_2025-12-05_at_09.05.07_1765244929384.jpeg";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
];

const features = [
  {
    icon: Satellite,
    title: "Monitoreo Satelital",
    description: "Imágenes satelitales de alta resolución con actualizaciones diarias para monitorear la salud de tus cultivos en tiempo real.",
  },
  {
    icon: BarChart3,
    title: "Predicción de Rendimiento",
    description: "Algoritmos de IA que predicen el rendimiento de tus cosechas con precisión, permitiendo una planificación estratégica.",
  },
  {
    icon: Cloud,
    title: "Análisis Climático",
    description: "Integración de datos meteorológicos avanzados para anticipar condiciones y proteger tus cultivos.",
  },
  {
    icon: Droplets,
    title: "Gestión de Riego",
    description: "Optimiza el uso del agua con recomendaciones inteligentes basadas en la humedad del suelo y pronósticos.",
  },
  {
    icon: Leaf,
    title: "Salud del Cultivo",
    description: "Detección temprana de plagas, enfermedades y deficiencias nutricionales mediante análisis de índices vegetativos.",
  },
  {
    icon: Zap,
    title: "Automatización",
    description: "Automatiza procesos críticos y recibe alertas personalizadas cuando tus cultivos necesitan atención.",
  },
];

const stats = [
  { value: "25%", label: "Incremento en rendimiento", icon: TrendingUp },
  { value: "30%", label: "Ahorro en recursos", icon: Droplets },
  { value: "24/7", label: "Monitoreo continuo", icon: Clock },
  { value: "200+", label: "Cultivos soportados", icon: Sprout },
];

const testimonials = [
  {
    quote: "SmartYield ha transformado nuestra operación agrícola. Hemos aumentado nuestro rendimiento en un 28% mientras reducimos el uso de agua significativamente.",
    name: "Carlos Mendoza",
    role: "Productor de Maíz",
    location: "Córdoba, Argentina",
    farmSize: "2,500 hectáreas",
  },
  {
    quote: "La precisión de las predicciones satelitales nos permite tomar decisiones informadas todos los días. Es como tener un agrónomo experto disponible 24/7.",
    name: "María García",
    role: "Gerente de Operaciones",
    location: "Santa Fe, Argentina",
    farmSize: "5,000 hectáreas",
  },
  {
    quote: "Implementar SmartYield fue la mejor decisión para nuestra cooperativa. La plataforma es intuitiva y el soporte técnico excepcional.",
    name: "Roberto Silva",
    role: "Director de Cooperativa",
    location: "Entre Ríos, Argentina",
    farmSize: "15,000 hectáreas",
  },
];

const partners = [
  "Universidad de Buenos Aires",
  "INTA",
  "Ministerio de Agricultura",
  "Banco Nación",
  "Syngenta",
  "Bayer CropScience",
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Solicitud enviada",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="SmartYield Logo"
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
                data-testid="img-logo"
              />
              <span className="font-display font-bold text-xl md:text-2xl text-foreground">
                SmartYield
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={() => scrollToSection("#contacto")}
                data-testid="button-demo-header"
              >
                Solicitar Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <nav className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                className="w-full mt-4"
                onClick={() => scrollToSection("#contacto")}
                data-testid="button-demo-mobile"
              >
                Solicitar Demo
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6" data-testid="badge-hero">
              <Satellite className="w-3 h-3 mr-1" />
              Tecnología Satelital de Precisión
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Optimiza tu Producción Agrícola con{" "}
              <span className="text-primary">Inteligencia Artificial</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Monitorea tus cultivos desde el espacio, predice rendimientos con precisión 
              y toma decisiones basadas en datos en tiempo real para maximizar tu producción.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => scrollToSection("#contacto")}
                className="min-w-[200px]"
                data-testid="button-demo-hero"
              >
                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] bg-background/50 backdrop-blur-sm"
                data-testid="button-video-hero"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver Video
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Setup en 24 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Soporte personalizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("#caracteristicas")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </button>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              <Leaf className="w-3 h-3 mr-1" />
              Características
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Todo lo que necesitas para una agricultura inteligente
            </h2>
            <p className="text-lg text-muted-foreground">
              Nuestra plataforma integra las tecnologías más avanzadas para 
              brindarte una visión completa de tus operaciones agrícolas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-card hover-elevate transition-all duration-300"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image placeholder */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        Dashboard Interactivo
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Visualiza métricas en tiempo real
                      </p>
                    </div>
                  </div>
                  {/* Decorative grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-6 bg-card rounded-lg p-4 border border-border shadow-lg hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">+28%</p>
                      <p className="text-xs text-muted-foreground">Rendimiento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">
                <Satellite className="w-3 h-3 mr-1" />
                Plataforma
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Monitorea tus campos desde cualquier lugar
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Accede a imágenes satelitales de alta resolución, índices de vegetación 
                y análisis predictivos desde nuestra plataforma web o aplicación móvil.
              </p>

              <ul className="space-y-4">
                {[
                  "Imágenes satelitales actualizadas cada 3-5 días",
                  "Índices NDVI, NDRE y análisis de clorofila",
                  "Mapas de zonificación para aplicación variable",
                  "Alertas automáticas de anomalías en cultivos",
                  "Exportación de datos en múltiples formatos",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8"
                onClick={() => scrollToSection("#contacto")}
                data-testid="button-platform-cta"
              >
                Explorar Plataforma
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section id="beneficios" className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Resultados que transforman tu operación
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Nuestros usuarios reportan mejoras significativas en sus operaciones agrícolas.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-primary-foreground/5 backdrop-blur-sm"
                data-testid={`stat-${index}`}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <p className="text-sm md:text-base text-primary-foreground/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Testimonios
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-muted-foreground">
              Productores de toda Argentina confían en SmartYield para optimizar sus operaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card"
                data-testid={`card-testimonial-${index}`}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location} • {testimonial.farmSize}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Empresas e instituciones que confían en nosotros
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors font-medium text-sm md:text-base"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-16 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Transforma tu Campo en una Operación Inteligente
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Únete a cientos de productores que ya están optimizando sus operaciones 
                con SmartYield. Comienza tu prueba gratuita hoy.
              </p>

              {/* Contact Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4" data-testid="form-contact">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Tu nombre"
                            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage className="text-primary-foreground/80" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="tu@email.com"
                            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage className="text-primary-foreground/80" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Tu teléfono (opcional)"
                            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage className="text-primary-foreground/80" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    disabled={contactMutation.isPending}
                    data-testid="button-submit-contact"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Comenzar Prueba Gratuita
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-sm text-primary-foreground/60">
                Sin tarjeta de crédito requerida • Configuración en 24 horas • Soporte dedicado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logoImage}
                  alt="SmartYield Logo"
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display font-bold text-xl text-foreground">
                  SmartYield
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Agricultura inteligente impulsada por datos satelitales e inteligencia artificial.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover-elevate"
                  data-testid="link-linkedin"
                >
                  <SiLinkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover-elevate"
                  data-testid="link-twitter"
                >
                  <SiX className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover-elevate"
                  data-testid="link-facebook"
                >
                  <SiFacebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover-elevate"
                  data-testid="link-instagram"
                >
                  <SiInstagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#caracteristicas" className="text-muted-foreground hover:text-foreground transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Integraciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Prensa
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@smartyield.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+54 11 1234-5678</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Buenos Aires, Argentina</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 SmartYield. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
