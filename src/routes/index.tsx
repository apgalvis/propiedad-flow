import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  MapPin,
  Home,
  Sparkles,
  Search,
  Plus,
  Minus,
  Upload,
  HelpCircle,
  Bed,
  Bath,
  Car,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  MessageCircle,
  X,
  Heart,
  Eye,
} from "lucide-react";
import propertyPreviewImg from "@/assets/property-preview.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Publica tu propiedad — Propiedades.com" },
      { name: "description", content: "Publica tu propiedad en Propiedades.com con un flujo guiado, simple y rápido." },
      { property: "og:title", content: "Publica tu propiedad — Propiedades.com" },
      { property: "og:description", content: "Flujo de publicación rediseñado para ser claro, corto y sin fricción." },
    ],
  }),
  component: Index,
});

/* ---------- Types ---------- */
type SectionId = "propiedad" | "especificaciones" | "contacto";
type SubId =
  | "ubicacion"
  | "basica"
  | "caracteristicas"
  | "amenidades"
  | "descripcion"
  | "imagenes"
  | "datos";

/* ---------- Small atoms ---------- */
function StatusDot({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  if (state === "active")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
    );
  return <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
}

function SectionHeader({
  index,
  title,
  summary,
  done,
  active,
  open,
  onToggle,
}: {
  index: number;
  title: string;
  summary?: string;
  done: boolean;
  active: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/40"
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors",
          done
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary/10 text-primary ring-1 ring-primary"
              : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index}
      </span>
      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {summary ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{summary}</p>
        ) : (
          !done && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {active ? "En progreso" : "Pendiente"}
            </p>
          )
        )}
      </div>
      <ChevronDown
        className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function SubHeader({
  code,
  title,
  done,
  open,
  onToggle,
  description,
}: {
  code: string;
  title: string;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  description?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <StatusDot state={done ? "done" : open ? "active" : "pending"} />
      <div className="flex-1">
        <span className="text-[14px] font-medium text-foreground">{title}</span>
        {description && open && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <ChevronDown
        className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function Stepper({
  value,
  onChange,
  min = 0,
  icon,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
        <span className="text-muted-foreground">{icon}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-base font-semibold tabular-nums">{value}</span>
          <button
            onClick={() => onChange(value + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SizeToggleBlock({
  title,
  enabled,
  onEnabledChange,
  value,
  onValueChange,
  fieldLabel,
}: {
  title: string;
  enabled: boolean;
  onEnabledChange: (b: boolean) => void;
  value: string;
  onValueChange: (v: string) => void;
  fieldLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>
      {enabled && (
        <div className="mt-4">
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {fieldLabel}
          </Label>
          <div className="flex items-stretch overflow-hidden rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary/30">
            <Input
              type="number"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
              placeholder="0"
            />
            <div className="flex items-center bg-muted px-3 text-sm font-medium text-muted-foreground">
              m²
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Constants ---------- */
const AMENITIES = [
  "Alberca", "Gimnasio", "Terraza", "Mascotas permitidas", "Aire acondicionado",
  "Seguridad privada 24/7", "Estacionamiento de visitas", "Roof garden", "Salón de eventos",
  "Área de BBQ", "Cancha de tenis", "Cancha de pádel", "Spa", "Sauna",
  "Jardín privado", "Bodega", "Elevador", "Lobby", "Coworking", "Cuarto de lavado",
];

const ANTIGUEDAD_OPTIONS = [
  "Nueva",
  "Menos de 1 año",
  "1 a 5 años",
  "5 a 10 años",
  "10 a 20 años",
  "Más de 20 años",
  "No estoy seguro",
];

/* ---------- Page ---------- */
function Index() {
  // Sections / subsections open state
  const [openSection, setOpenSection] = useState<SectionId>("especificaciones");
  const [openSub, setOpenSub] = useState<SubId>("caracteristicas");

  // Sec 1
  const [operacion, setOperacion] = useState("Venta");
  const [tipoPropiedad, setTipoPropiedad] = useState("Casa");
  const [precio, setPrecio] = useState("4500000");
  const [direccion] = useState("Av. Reforma 123, Polanco, CDMX");

  // Sec 2.1
  const [recamaras, setRecamaras] = useState(3);
  const [banos, setBanos] = useState(2);
  const [mediosBanos, setMediosBanos] = useState(1);
  const [niveles, setNiveles] = useState(1);
  const [estac, setEstac] = useState(2);
  const [antiguedad, setAntiguedad] = useState("5 a 10 años");
  const [terreno, setTerreno] = useState(true);
  const [terrenoSize, setTerrenoSize] = useState("250");
  const [construccion, setConstruccion] = useState(true);
  const [construccionSize, setConstruccionSize] = useState("180");
  const [jardin, setJardin] = useState(true);
  const [jardinSize, setJardinSize] = useState("50");
  const [usoSuelo, setUsoSuelo] = useState("Comercial");
  const [tipoRancho, setTipoRancho] = useState("Agrícola");

  // 2.2
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Alberca", "Gimnasio", "Seguridad privada 24/7",
  ]);
  const [amenitySearch, setAmenitySearch] = useState("");

  // 2.3
  const [descripcion, setDescripcion] = useState("");

  // 2.4
  const [imageCount] = useState(0);

  // 3
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tel, setTel] = useState("");
  const [whats, setWhats] = useState("");

  /* ---------- Completion logic ---------- */
  const ubicacionDone = true;
  const basicaDone = !!(operacion && tipoPropiedad && precio);
  const propiedadDone = ubicacionDone && basicaDone;

  const caractDone = true;
  const amenidadesDone = selectedAmenities.length > 0;
  const descripcionDone = descripcion.trim().length >= 40;
  const imagenesDone = imageCount >= 5;
  const especificacionesDone = caractDone && amenidadesDone && descripcionDone && imagenesDone;

  const contactoDone = !!(nombre && correo && tel);

  /* ---------- Summaries ---------- */
  const propiedadSummary = propiedadDone
    ? `${operacion} · ${tipoPropiedad} · $${Number(precio).toLocaleString("es-MX")} MXN`
    : undefined;

  const especSummary = useMemo(() => {
    const parts = [
      `${recamaras} recámaras`,
      `${banos} baños`,
      construccion ? `${construccionSize} m² construcción` : null,
    ].filter(Boolean);
    return especificacionesDone ? parts.join(" · ") : `${parts.slice(0, 3).join(" · ")}`;
  }, [recamaras, banos, construccion, construccionSize, especificacionesDone]);

  const contactoSummary = contactoDone ? `${nombre} · ${tel}` : undefined;

  /* ---------- Helpers ---------- */
  const totalSubsDone =
    Number(caractDone) + Number(amenidadesDone) + Number(descripcionDone) + Number(imagenesDone);

  const filteredAmenities = AMENITIES.filter((a) =>
    a.toLowerCase().includes(amenitySearch.toLowerCase()),
  );

  const toggleSection = (s: SectionId) =>
    setOpenSection((cur) => (cur === s ? ("" as SectionId) : s));

  const continueFromCaract = () => {
    setOpenSub("amenidades");
  };

  /* ---------- Sidebar items ---------- */
  const sideSections: {
    id: SectionId;
    n: number;
    label: string;
    done: boolean;
    subs: { id: SubId; code: string; label: string; done: boolean }[];
  }[] = [
    {
      id: "propiedad",
      n: 1,
      label: "Propiedad",
      done: propiedadDone,
      subs: [
        { id: "ubicacion", code: "1.1", label: "Ubicación", done: ubicacionDone },
        { id: "basica", code: "1.2", label: "Información básica", done: basicaDone },
      ],
    },
    {
      id: "especificaciones",
      n: 2,
      label: "Especificaciones",
      done: especificacionesDone,
      subs: [
        { id: "caracteristicas", code: "2.1", label: "Características", done: caractDone },
        { id: "amenidades", code: "2.2", label: "Amenidades y servicios", done: amenidadesDone },
        { id: "descripcion", code: "2.3", label: "Descripción", done: descripcionDone },
        { id: "imagenes", code: "2.4", label: "Imágenes", done: imagenesDone },
      ],
    },
    {
      id: "contacto",
      n: 3,
      label: "Contacto",
      done: contactoDone,
      subs: [{ id: "datos", code: "3.1", label: "Datos de contacto", done: contactoDone }],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-8 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="text-lg font-semibold tracking-tight">
            Propiedades<span className="text-primary">.com</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-2.5 w-2.5" strokeWidth={4} />
            </span>
            Guardado automáticamente
          </div>
          <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
            Guardar y salir
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-[260px_1fr_340px] gap-8 px-8 py-10">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
              Publica tu propiedad
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa los 3 pasos para llegar a más compradores.
            </p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span className="font-medium text-foreground">
                {Number(propiedadDone) + Number(especificacionesDone) + Number(contactoDone)} de 3
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${
                    ((Number(propiedadDone) + Number(especificacionesDone) + Number(contactoDone)) /
                      3) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <nav className="space-y-1">
            {sideSections.map((s) => {
              const expanded = openSection === s.id;
              return (
                <div key={s.id}>
                  <button
                    onClick={() => setOpenSection(s.id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      expanded ? "bg-accent/60" : "hover:bg-muted/60",
                    ].join(" ")}
                  >
                    <StatusDot state={s.done ? "done" : expanded ? "active" : "pending"} />
                    <span className="flex-1 text-sm font-medium">
                      {s.n}. {s.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-4">
                      {s.subs.map((sub) => {
                        const isActive = openSub === sub.id && expanded;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setOpenSection(s.id);
                              setOpenSub(sub.id);
                            }}
                            className={[
                              "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                              isActive
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground",
                            ].join(" ")}
                          >
                            <StatusDot
                              state={sub.done ? "done" : isActive ? "active" : "pending"}
                            />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Help card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">¿Necesitas ayuda?</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Nuestro equipo está listo para apoyarte en cada paso.
            </p>
            <button className="mt-3 text-xs font-medium text-primary hover:underline">
              Contactar a soporte →
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-4">
          {/* SECTION 1 — PROPIEDAD */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <SectionHeader
              index={1}
              title="Propiedad"
              summary={propiedadSummary}
              done={propiedadDone}
              active={openSection === "propiedad"}
              open={openSection === "propiedad"}
              onToggle={() => toggleSection("propiedad")}
            />
            {openSection === "propiedad" && (
              <div className="border-t border-border px-7 pb-6">
                <div className="divide-y divide-border">
                  <div>
                    <SubHeader
                      code="1.1"
                      title="Ubicación"
                      done={ubicacionDone}
                      open={openSub === "ubicacion"}
                      onToggle={() =>
                        setOpenSub(openSub === "ubicacion" ? ("" as SubId) : "ubicacion")
                      }
                      description="Indica dónde se encuentra tu propiedad."
                    />
                    {openSub === "ubicacion" && (
                      <div className="space-y-4 pb-5">
                        <div>
                          <Label className="mb-1.5 block text-sm">Dirección *</Label>
                          <div className="flex items-center rounded-lg border border-border bg-card px-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                              defaultValue={direccion}
                              className="border-0 shadow-none focus-visible:ring-0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="mb-1.5 block text-sm">Ciudad *</Label>
                            <Input defaultValue="Ciudad de México" />
                          </div>
                          <div>
                            <Label className="mb-1.5 block text-sm">Colonia *</Label>
                            <Input defaultValue="Polanco" />
                          </div>
                          <div>
                            <Label className="mb-1.5 block text-sm">Código postal *</Label>
                            <Input defaultValue="11560" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <SubHeader
                      code="1.2"
                      title="Información básica"
                      done={basicaDone}
                      open={openSub === "basica"}
                      onToggle={() =>
                        setOpenSub(openSub === "basica" ? ("" as SubId) : "basica")
                      }
                      description="Operación, tipo de propiedad y precio."
                    />
                    {openSub === "basica" && (
                      <div className="space-y-4 pb-5">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="mb-1.5 block text-sm">Operación *</Label>
                            <Select value={operacion} onValueChange={setOperacion}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Venta">Venta</SelectItem>
                                <SelectItem value="Renta">Renta</SelectItem>
                                <SelectItem value="Venta o renta">Venta o renta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-1.5 block text-sm">Tipo de propiedad *</Label>
                            <Select value={tipoPropiedad} onValueChange={setTipoPropiedad}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Departamento">Departamento</SelectItem>
                                <SelectItem value="Terreno">Terreno</SelectItem>
                                <SelectItem value="Oficina">Oficina</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-1.5 block text-sm">Precio (MXN) *</Label>
                            <Input
                              type="number"
                              value={precio}
                              onChange={(e) => setPrecio(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => {
                              setOpenSection("especificaciones");
                              setOpenSub("caracteristicas");
                            }}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2 — ESPECIFICACIONES */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <SectionHeader
              index={2}
              title="Especificaciones"
              summary={
                openSection === "especificaciones"
                  ? `${totalSubsDone} de 4 subsecciones completadas`
                  : especSummary
              }
              done={especificacionesDone}
              active={openSection === "especificaciones"}
              open={openSection === "especificaciones"}
              onToggle={() => toggleSection("especificaciones")}
            />
            {openSection === "especificaciones" && (
              <div className="border-t border-border px-7 pb-6">
                <div className="divide-y divide-border">
                  {/* 2.1 Características */}
                  <div>
                    <SubHeader
                      code="2.1"
                      title="Características"
                      done={caractDone}
                      open={openSub === "caracteristicas"}
                      onToggle={() =>
                        setOpenSub(
                          openSub === "caracteristicas" ? ("" as SubId) : "caracteristicas",
                        )
                      }
                      description="Cuéntanos los detalles principales de tu propiedad."
                    />
                    {openSub === "caracteristicas" && (
                      <div className="space-y-6 pb-6">
                        <div className="grid grid-cols-4 gap-4">
                          <Stepper label="Recámaras *" value={recamaras} onChange={setRecamaras} icon={<Bed className="h-4 w-4" />} />
                          <Stepper label="Baños *" value={banos} onChange={setBanos} icon={<Bath className="h-4 w-4" />} />
                          <Stepper label="Medios baños" value={mediosBanos} onChange={setMediosBanos} icon={<Bath className="h-4 w-4" />} />
                          <Stepper label="Niveles" value={niveles} onChange={setNiveles} min={1} icon={<Home className="h-4 w-4" />} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Stepper label="Estacionamiento(s)" value={estac} onChange={setEstac} icon={<Car className="h-4 w-4" />} />
                          <div>
                            <Label className="mb-1.5 block text-sm font-medium">Antigüedad *</Label>
                            <Select value={antiguedad} onValueChange={setAntiguedad}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ANTIGUEDAD_OPTIONS.map((o) => (
                                  <SelectItem key={o} value={o}>{o}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <SizeToggleBlock
                            title="Terreno"
                            enabled={terreno}
                            onEnabledChange={setTerreno}
                            value={terrenoSize}
                            onValueChange={setTerrenoSize}
                            fieldLabel="Tamaño del terreno"
                          />
                          <SizeToggleBlock
                            title="Construcción"
                            enabled={construccion}
                            onEnabledChange={setConstruccion}
                            value={construccionSize}
                            onValueChange={setConstruccionSize}
                            fieldLabel="Tamaño de construcción"
                          />
                          <SizeToggleBlock
                            title="Jardín"
                            enabled={jardin}
                            onEnabledChange={setJardin}
                            value={jardinSize}
                            onValueChange={setJardinSize}
                            fieldLabel="Tamaño del jardín"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-1.5 block text-sm font-medium">Uso de suelo *</Label>
                            <Select value={usoSuelo} onValueChange={setUsoSuelo}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Habitacional">Habitacional</SelectItem>
                                <SelectItem value="Comercial">Comercial</SelectItem>
                                <SelectItem value="Mixto">Mixto</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-1.5 block text-sm font-medium">Tipo de rancho</Label>
                            <div className="inline-flex rounded-lg border border-border bg-card p-1">
                              {["No aplica", "Agrícola", "Ganadero"].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTipoRancho(t)}
                                  className={[
                                    "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                                    tipoRancho === t
                                      ? "bg-primary text-primary-foreground"
                                      : "text-muted-foreground hover:text-foreground",
                                  ].join(" ")}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={continueFromCaract}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2.2 Amenidades */}
                  <div>
                    <SubHeader
                      code="2.2"
                      title="Amenidades y servicios"
                      done={amenidadesDone}
                      open={openSub === "amenidades"}
                      onToggle={() =>
                        setOpenSub(openSub === "amenidades" ? ("" as SubId) : "amenidades")
                      }
                      description="Selecciona las amenidades que ofrece la propiedad."
                    />
                    {openSub === "amenidades" && (
                      <div className="pb-6">
                        {selectedAmenities.length === 0 ? (
                          <button
                            onClick={() => setAmenitiesOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-8 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
                          >
                            <Plus className="h-4 w-4" />
                            Agregar amenidades
                          </button>
                        ) : (
                          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold">
                                {selectedAmenities.length} amenidades seleccionadas
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {selectedAmenities.slice(0, 3).join(", ")}
                                {selectedAmenities.length > 3 &&
                                  ` y ${selectedAmenities.length - 3} más`}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => setAmenitiesOpen(true)}
                              className="rounded-full"
                            >
                              Editar
                            </Button>
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => setOpenSub("descripcion")}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                            disabled={!amenidadesDone}
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2.3 Descripción */}
                  <div>
                    <SubHeader
                      code="2.3"
                      title="Descripción"
                      done={descripcionDone}
                      open={openSub === "descripcion"}
                      onToggle={() =>
                        setOpenSub(openSub === "descripcion" ? ("" as SubId) : "descripcion")
                      }
                      description="Describe lo que hace única a tu propiedad."
                    />
                    {openSub === "descripcion" && (
                      <div className="space-y-3 pb-6">
                        <Textarea
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          placeholder="Habla de la ubicación, los acabados, el entorno y por qué es una gran opción..."
                          className="min-h-[180px] resize-none"
                          maxLength={1500}
                        />
                        <div className="flex items-center justify-between">
                          <Button variant="outline" className="rounded-full gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Mejorar con IA
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {descripcion.length} / 1500
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setOpenSub("imagenes")}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2.4 Imágenes */}
                  <div>
                    <SubHeader
                      code="2.4"
                      title="Imágenes"
                      done={imagenesDone}
                      open={openSub === "imagenes"}
                      onToggle={() =>
                        setOpenSub(openSub === "imagenes" ? ("" as SubId) : "imagenes")
                      }
                      description="Sube fotos de alta calidad para destacar tu propiedad."
                    />
                    {openSub === "imagenes" && (
                      <div className="space-y-3 pb-6">
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                            <Upload className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold">
                              Arrastra tus imágenes aquí
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              o{" "}
                              <span className="text-primary underline cursor-pointer">
                                selecciónalas desde tu equipo
                              </span>
                              . JPG o PNG, máx. 10 MB c/u.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {imageCount} de 20 imágenes recomendadas
                          </span>
                          <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${(imageCount / 20) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3 — CONTACTO */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <SectionHeader
              index={3}
              title="Contacto"
              summary={contactoSummary}
              done={contactoDone}
              active={openSection === "contacto"}
              open={openSection === "contacto"}
              onToggle={() => toggleSection("contacto")}
            />
            {openSection === "contacto" && (
              <div className="border-t border-border px-7 pb-6 pt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block text-sm">Nombre *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input value={nombre} onChange={(e) => setNombre(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="Juan Pérez" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Correo *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input value={correo} onChange={(e) => setCorreo(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="tucorreo@ejemplo.com" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Teléfono *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input value={tel} onChange={(e) => setTel(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="55 1234 5678" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">WhatsApp</Label>
                    <div className="flex items-center rounded-lg border border-border px-3">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <Input value={whats} onChange={(e) => setWhats(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="55 1234 5678" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="rounded-full bg-primary px-8 hover:bg-primary/90">
                    Publicar propiedad
                  </Button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Amenities dialog */}
      <Dialog open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Selecciona amenidades</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={amenitySearch}
              onChange={(e) => setAmenitySearch(e.target.value)}
              placeholder="Buscar amenidad..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {amenitySearch && (
              <button onClick={() => setAmenitySearch("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="max-h-[340px] space-y-1 overflow-y-auto pr-1">
            {filteredAmenities.map((a) => {
              const checked = selectedAmenities.includes(a);
              return (
                <label
                  key={a}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/60"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => {
                      setSelectedAmenities((cur) =>
                        c ? [...cur, a] : cur.filter((x) => x !== a),
                      );
                    }}
                  />
                  <span className="text-sm">{a}</span>
                </label>
              );
            })}
            {filteredAmenities.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sin resultados para "{amenitySearch}"
              </p>
            )}
          </div>
          <DialogFooter className="items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">
              {selectedAmenities.length} seleccionadas
            </span>
            <Button
              onClick={() => setAmenitiesOpen(false)}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Guardar selección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
