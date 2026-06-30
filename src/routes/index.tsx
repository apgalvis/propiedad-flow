import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  MapPin,
  Home,
  Sparkles,
  Plus,
  Minus,
  Upload,
  Bed,
  Bath,
  Car,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  MessageCircle,
  Heart,
  Eye,
  HelpCircle,
} from "lucide-react";
import propertyPreviewImg from "@/assets/property-preview.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <span
        key="done"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground animate-scale-in"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  if (state === "active")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-secondary transition-colors">
        <span className="h-2 w-2 rounded-full bg-secondary" />
      </span>
    );
  return <span className="h-5 w-5 rounded-full border-2 border-border transition-colors" aria-hidden="true" />;
}

function SectionHeader({
  id,
  panelId,
  index,
  title,
  summary,
  done,
  active,
  open,
  onToggle,
}: {
  id: string;
  panelId: string;
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
      id={id}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      className="flex w-full items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
    >
      <span
        key={done ? "done" : "pending"}
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300",
          done
            ? "bg-secondary text-secondary-foreground animate-scale-in"
            : active
              ? "bg-secondary/10 text-secondary ring-1 ring-secondary"
              : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[15px] font-semibold text-foreground">{title}</h2>
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
        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

function SubHeader({
  id,
  panelId,
  title,
  done,
  open,
  onToggle,
  description,
}: {
  id: string;
  panelId: string;
  title: string;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  description?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      className="flex w-full items-center gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
    >
      <StatusDot state={done ? "done" : open ? "active" : "pending"} />
      <div className="min-w-0 flex-1">
        <span className="text-[14px] font-medium text-foreground">{title}</span>
        {description && open && (
          <p className="mt-0.5 text-xs text-muted-foreground animate-fade-in">{description}</p>
        )}
      </div>
      <ChevronDown
        className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

/* Wrapper that animates open/close of accordion content */
function Collapse({ id, open, children }: { id?: string; open: boolean; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="overflow-hidden" inert={!open}>
        {children}
      </div>
    </div>
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
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 transition-colors focus-within:border-primary hover:border-primary/40">
        <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-90"
            aria-label={`Restar ${label.replace(" *", "").replace("(s)", "")}`}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            key={value}
            className="inline-block w-6 text-center text-base font-semibold tabular-nums animate-scale-in"
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-90"
            aria-label={`Sumar ${label.replace(" *", "").replace("(s)", "")}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Sí / No con tamaño condicional */
function PresenceBlock({
  title,
  emoji,
  has,
  onHasChange,
  value,
  onValueChange,
  fieldLabel,
}: {
  title: string;
  emoji: string;
  has: boolean | null;
  onHasChange: (b: boolean) => void;
  value: string;
  onValueChange: (v: string) => void;
  fieldLabel: string;
}) {
  const answered = has !== null;
  return (
    <div
      className={[
        "rounded-xl border bg-card p-4 transition-all duration-300",
        answered ? "border-border" : "border-dashed border-border",
        has ? "ring-1 ring-primary/20" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">{emoji}</span>
          <span className="truncate text-sm font-semibold text-foreground">{title} *</span>
        </div>
        <div
          role="group"
          aria-label={`¿Tiene ${title.toLowerCase()}?`}
          className="inline-flex shrink-0 rounded-full border border-border bg-muted/40 p-0.5 text-xs font-medium"
        >
          <button
            type="button"
            onClick={() => onHasChange(true)}
            aria-pressed={has === true}
            className={[
              "rounded-full px-3 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
              has === true
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => onHasChange(false)}
            aria-pressed={has === false}
            className={[
              "rounded-full px-3 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
              has === false
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            No
          </button>
        </div>
      </div>

      <Collapse open={!!has}>
        <div className="mt-4">
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {fieldLabel}
          </Label>
          <div className="flex items-stretch overflow-hidden rounded-lg border border-border transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
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
      </Collapse>

      {has === false && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
          Sin {title.toLowerCase()}
        </p>
      )}
    </div>
  );
}

/* ---------- Constants ---------- */
type Amenity = { id: string; label: string; emoji: string; countable?: boolean };
type AmenityGroup = { id: string; label: string; hint?: string; items: Amenity[] };

const AMENITY_GROUPS: AmenityGroup[] = [
  {
    id: "wellness",
    label: "Bienestar y recreación",
    items: [
      { id: "alberca", label: "Alberca", emoji: "🏊" },
      { id: "gimnasio", label: "Gimnasio", emoji: "🏋️" },
      { id: "spa", label: "Spa", emoji: "💆" },
      { id: "sauna", label: "Sauna", emoji: "♨️" },
      { id: "roof", label: "Roof garden", emoji: "🌇" },
      { id: "tenis", label: "Cancha de tenis", emoji: "🎾" },
      { id: "padel", label: "Cancha de pádel", emoji: "🏓" },
      { id: "bbq", label: "Área de BBQ", emoji: "🍖" },
    ],
  },
  {
    id: "services",
    label: "Servicios del edificio",
    items: [
      { id: "seguridad", label: "Seguridad 24/7", emoji: "🛡️" },
      { id: "visitas", label: "Estacionamiento de visitas", emoji: "🅿️" },
      { id: "elevador", label: "Elevador", emoji: "🛗" },
      { id: "lavado", label: "Cuarto de lavado", emoji: "🧺" },
      { id: "ac", label: "Aire acondicionado", emoji: "❄️" },
      { id: "lobby", label: "Lobby", emoji: "🛋️" },
      { id: "coworking", label: "Coworking", emoji: "💻" },
      { id: "eventos", label: "Salón de eventos", emoji: "🎉" },
    ],
  },
  {
    id: "lifestyle",
    label: "Estilo de vida",
    items: [
      { id: "pet", label: "Pet friendly", emoji: "🐾" },
      { id: "jardincomun", label: "Jardín común", emoji: "🌳" },
    ],
  },
  {
    id: "countable",
    label: "¿Cuántos tiene tu propiedad?",
    hint: "Toca para agregar y usa + / − para indicar la cantidad.",
    items: [
      { id: "balcon", label: "Balcón", emoji: "🌅", countable: true },
      { id: "chimenea", label: "Chimenea", emoji: "🔥", countable: true },
      { id: "terraza", label: "Terraza privada", emoji: "🌿", countable: true },
      { id: "bodega", label: "Bodega", emoji: "📦", countable: true },
      { id: "jardinpriv", label: "Jardín privado", emoji: "🌷", countable: true },
    ],
  },
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

/* ---------- Amenity chip ---------- */
function AmenityChip({
  item,
  count,
  onChange,
}: {
  item: Amenity;
  count: number;
  onChange: (n: number) => void;
}) {
  const selected = count > 0;

  if (item.countable) {
    return (
      <div
        className={[
          "group flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm transition-all duration-200",
          selected
            ? "border-secondary bg-secondary/10 text-foreground shadow-sm"
            : "border-border bg-card text-foreground hover:border-secondary/50 hover:bg-muted/40",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => onChange(selected ? 0 : 1)}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 rounded-full"
          aria-pressed={selected}
          aria-label={selected ? `Desactivar ${item.label}` : `Activar ${item.label}`}
        >
          <span className="text-base leading-none" aria-hidden="true">{item.emoji}</span>
          <span className="font-medium">{item.label}</span>
        </button>
        {selected && (
          <div className="ml-1 flex items-center gap-1.5 rounded-full bg-background/80 px-1 py-0.5 animate-fade-in">
            <button
              type="button"
              onClick={() => onChange(Math.max(0, count - 1))}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-secondary active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
              aria-label={`Restar ${item.label}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span
              key={count}
              className="inline-block w-3 text-center text-xs font-bold tabular-nums text-secondary animate-scale-in"
              aria-live="polite"
              aria-atomic="true"
            >
              {count}
            </span>
            <button
              type="button"
              onClick={() => onChange(count + 1)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-secondary active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
              aria-label={`Sumar ${item.label}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onChange(selected ? 0 : 1)}
      className={[
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
        selected
          ? "border-secondary bg-secondary/10 text-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-secondary/50 hover:bg-muted/40",
      ].join(" ")}
      aria-pressed={selected}
      aria-label={selected ? `Desactivar ${item.label}` : `Activar ${item.label}`}
    >
      <span className="text-base leading-none" aria-hidden="true">{item.emoji}</span>
      <span className="font-medium">{item.label}</span>
      {selected && (
        <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground animate-scale-in" aria-hidden="true">
          <Check className="h-2.5 w-2.5" strokeWidth={4} />
        </span>
      )}
    </button>
  );
}

/* ---------- Page ---------- */
function Index() {
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

  const [terreno, setTerreno] = useState<boolean | null>(true);
  const [terrenoSize, setTerrenoSize] = useState("250");
  const [construccion, setConstruccion] = useState<boolean | null>(true);
  const [construccionSize, setConstruccionSize] = useState("180");
  const [jardin, setJardin] = useState<boolean | null>(true);
  const [jardinSize, setJardinSize] = useState("50");

  const [usoSuelo, setUsoSuelo] = useState("Comercial");
  const [tipoRancho, setTipoRancho] = useState("Agrícola");

  // 2.2 Amenidades inline
  const [amenities, setAmenities] = useState<Record<string, number>>({
    alberca: 1,
    gimnasio: 1,
    seguridad: 1,
    balcon: 2,
  });

  // 2.3
  const [descripcion, setDescripcion] = useState("");

  // 2.4
  const [imageCount] = useState(0);

  // 3
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tel, setTel] = useState("");
  const [whats, setWhats] = useState("");

  /* ---------- Completion ---------- */
  const ubicacionDone = true;
  const basicaDone = !!(operacion && tipoPropiedad && precio);
  const propiedadDone = ubicacionDone && basicaDone;

  const presenceAnswered = terreno !== null && construccion !== null && jardin !== null;
  const caractDone = presenceAnswered;
  const amenidadesCount = Object.values(amenities).filter((n) => n > 0).length;
  const amenidadesDone = amenidadesCount > 0;
  const descripcionDone = descripcion.trim().length >= 40;
  const imagenesDone = imageCount >= 5;
  const especificacionesDone = caractDone && amenidadesDone && descripcionDone && imagenesDone;

  const contactoDone = !!(nombre && correo && tel);

  /* ---------- Summaries ---------- */
  const formatEstac = (n: number) => `${n} ${n === 1 ? "estacionamiento" : "estacionamientos"}`;

  const propiedadSummary = useMemo(() => {
    const op = operacion || "—";
    const tipo = tipoPropiedad || "—";
    const precioNum = Number(precio);
    const precioText = precio && !isNaN(precioNum) && precioNum > 0
      ? `$${precioNum.toLocaleString("es-MX")} MXN`
      : "— MXN";
    return `${op} · ${tipo} · ${precioText} · ${formatEstac(estac)}`;
  }, [operacion, tipoPropiedad, precio, estac]);

  const especSummary = useMemo(() => {
    const parts = [
      `${recamaras} recámaras`,
      `${banos} baños`,
      construccion ? `${construccionSize} m² construcción` : null,
    ].filter(Boolean);
    return parts.join(" · ");
  }, [recamaras, banos, construccion, construccionSize]);

  const contactoSummary = contactoDone ? `${nombre} · ${tel}` : undefined;

  const totalSubsDone =
    Number(caractDone) + Number(amenidadesDone) + Number(descripcionDone) + Number(imagenesDone);

  const toggleSection = (s: SectionId) =>
    setOpenSection((cur) => (cur === s ? ("" as SectionId) : s));

  /* ---------- Sidebar ---------- */
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

  const setAmenity = (id: string, n: number) =>
    setAmenities((cur) => ({ ...cur, [id]: n }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — brand hero look */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-secondary px-4 py-3 text-secondary-foreground sm:px-8 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="truncate text-base font-semibold tracking-tight sm:text-lg">
            Propiedades<span className="text-primary">.com</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2 text-sm text-secondary-foreground/80 md:flex">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Check className="h-2.5 w-2.5" strokeWidth={4} />
            </span>
            Guardado automáticamente
          </div>
          <Button
            variant="outline"
            className="h-9 rounded-full border-white/20 bg-transparent px-3 text-xs text-secondary-foreground hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Guardar y salir</span>
            <span className="sm:hidden">Guardar</span>
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[240px_1fr_320px] lg:gap-8 lg:px-8 lg:py-10">
        {/* Sidebar */}
        <aside className="hidden space-y-6 lg:block">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
              Publica tu propiedad
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa los 3 pasos para llegar a más compradores.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span className="font-medium text-foreground">
                {Number(propiedadDone) + Number(especificacionesDone) + Number(contactoDone)} de 3
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
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
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  <Collapse open={expanded}>
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
                  </Collapse>
                </div>
              );
            })}
          </nav>

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

        {/* Mobile heading + progress */}
        <div className="lg:hidden">
          <h1 className="text-xl font-semibold tracking-tight">Publica tu propiedad</h1>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: `${
                    ((Number(propiedadDone) + Number(especificacionesDone) + Number(contactoDone)) /
                      3) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="font-medium text-foreground">
              {Number(propiedadDone) + Number(especificacionesDone) + Number(contactoDone)}/3
            </span>
          </div>
        </div>

        {/* Main */}
        <main className="space-y-4">
          {/* SECTION 1 — PROPIEDAD */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <SectionHeader
              id="sec-h-propiedad"
              panelId="sec-p-propiedad"
              index={1}
              title="Propiedad"
              summary={propiedadSummary}
              done={propiedadDone}
              active={openSection === "propiedad"}
              open={openSection === "propiedad"}
              onToggle={() => toggleSection("propiedad")}
            />
            <Collapse id="sec-p-propiedad" open={openSection === "propiedad"}>
              <div className="border-t border-border px-4 pb-6 pt-1 sm:px-6">
                <div className="divide-y divide-border">
                  <div>
                    <SubHeader
                      id="sub-h-ubicacion"
                      panelId="sub-p-ubicacion"
                      title="Ubicación"
                      done={ubicacionDone}
                      open={openSub === "ubicacion"}
                      onToggle={() =>
                        setOpenSub(openSub === "ubicacion" ? ("" as SubId) : "ubicacion")
                      }
                      description="Indica dónde se encuentra tu propiedad."
                    />
                    <Collapse id="sub-p-ubicacion" open={openSub === "ubicacion"}>
                      <div className="space-y-4 pb-5">
                        <div>
                          <Label className="mb-1.5 block text-sm">Dirección *</Label>
                          <div className="flex items-center rounded-lg border border-border bg-card px-3 transition-colors focus-within:border-primary">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                              defaultValue={direccion}
                              className="border-0 shadow-none focus-visible:ring-0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    </Collapse>
                  </div>
                  <div>
                    <SubHeader
                      id="sub-h-basica"
                      panelId="sub-p-basica"
                      title="Información básica"
                      done={basicaDone}
                      open={openSub === "basica"}
                      onToggle={() =>
                        setOpenSub(openSub === "basica" ? ("" as SubId) : "basica")
                      }
                      description="Operación, tipo de propiedad y precio."
                    />
                    <Collapse id="sub-p-basica" open={openSub === "basica"}>
                      <div className="space-y-4 pb-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    </Collapse>
                  </div>
                </div>
              </div>
            </Collapse>
          </section>

          {/* SECTION 2 — ESPECIFICACIONES */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <SectionHeader
              id="sec-h-especificaciones"
              panelId="sec-p-especificaciones"
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
            <Collapse id="sec-p-especificaciones" open={openSection === "especificaciones"}>
              <div className="border-t border-border px-4 pb-6 pt-1 sm:px-6">
                <div className="divide-y divide-border">
                  {/* 2.1 Características */}
                  <div>
                    <SubHeader
                      id="sub-h-caracteristicas"
                      panelId="sub-p-caracteristicas"
                      title="Características"
                      done={caractDone}
                      open={openSub === "caracteristicas"}
                      onToggle={() =>
                        setOpenSub(openSub === "caracteristicas" ? ("" as SubId) : "caracteristicas")
                      }
                      description="Cuéntanos los detalles principales de tu propiedad."
                    />
                    <Collapse id="sub-p-caracteristicas" open={openSub === "caracteristicas"}>
                      <div className="space-y-6 pb-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                          <Stepper label="Recámaras *" value={recamaras} onChange={setRecamaras} icon={<Bed className="h-4 w-4" />} />
                          <Stepper label="Baños *" value={banos} onChange={setBanos} icon={<Bath className="h-4 w-4" />} />
                          <Stepper label="Medios baños" value={mediosBanos} onChange={setMediosBanos} icon={<Bath className="h-4 w-4" />} />
                          <Stepper label="Niveles" value={niveles} onChange={setNiveles} min={1} icon={<Home className="h-4 w-4" />} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                        <div>
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Espacios exteriores
                          </p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <PresenceBlock
                              title="Terreno"
                              emoji="🗺️"
                              has={terreno}
                              onHasChange={setTerreno}
                              value={terrenoSize}
                              onValueChange={setTerrenoSize}
                              fieldLabel="Tamaño del terreno"
                            />
                            <PresenceBlock
                              title="Construcción"
                              emoji="🏗️"
                              has={construccion}
                              onHasChange={setConstruccion}
                              value={construccionSize}
                              onValueChange={setConstruccionSize}
                              fieldLabel="Tamaño de construcción"
                            />
                            <PresenceBlock
                              title="Jardín"
                              emoji="🌳"
                              has={jardin}
                              onHasChange={setJardin}
                              value={jardinSize}
                              onValueChange={setJardinSize}
                              fieldLabel="Tamaño del jardín"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            <div className="inline-flex flex-wrap rounded-lg border border-border bg-card p-1">
                              {["No aplica", "Agrícola", "Ganadero"].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setTipoRancho(t)}
                                  className={[
                                    "rounded-md px-3 py-1.5 text-sm font-medium transition-all active:scale-95 sm:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                                    tipoRancho === t
                                      ? "bg-primary text-primary-foreground shadow-sm"
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
                            onClick={() => setOpenSub("amenidades")}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                            disabled={!caractDone}
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                  </div>

                  {/* 2.2 Amenidades INLINE */}
                  <div>
                    <SubHeader
                      id="sub-h-amenidades"
                      panelId="sub-p-amenidades"
                      title="Amenidades y servicios"
                      done={amenidadesDone}
                      open={openSub === "amenidades"}
                      onToggle={() =>
                        setOpenSub(openSub === "amenidades" ? ("" as SubId) : "amenidades")
                      }
                      description="Toca para activar. En las contables usa + / − para indicar la cantidad."
                    />
                    <Collapse id="sub-p-amenidades" open={openSub === "amenidades"}>
                      <div className="space-y-6 pb-6">
                        {AMENITY_GROUPS.map((g) => (
                          <div key={g.id}>
                            <div className="mb-2.5 flex items-baseline justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {g.label}
                              </p>
                              {g.hint && (
                                <p className="text-[11px] text-muted-foreground/80">{g.hint}</p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {g.items.map((it) => (
                                <AmenityChip
                                  key={it.id}
                                  item={it}
                                  count={amenities[it.id] ?? 0}
                                  onChange={(n) => setAmenity(it.id, n)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{amenidadesCount}</span>{" "}
                            amenidades seleccionadas
                          </span>
                          <Button
                            onClick={() => setOpenSub("descripcion")}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                            disabled={!amenidadesDone}
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                  </div>

                  {/* 2.3 Descripción */}
                  <div>
                    <SubHeader
                      id="sub-h-descripcion"
                      panelId="sub-p-descripcion"
                      title="Descripción"
                      done={descripcionDone}
                      open={openSub === "descripcion"}
                      onToggle={() =>
                        setOpenSub(openSub === "descripcion" ? ("" as SubId) : "descripcion")
                      }
                      description="Describe lo que hace única a tu propiedad."
                    />
                    <Collapse id="sub-p-descripcion" open={openSub === "descripcion"}>
                      <div className="space-y-3 pb-6">
                        <Textarea
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          placeholder="Habla de la ubicación, los acabados, el entorno y por qué es una gran opción..."
                          className="min-h-[180px] resize-none"
                          maxLength={1500}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
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
                    </Collapse>
                  </div>

                  {/* 2.4 Imágenes */}
                  <div>
                    <SubHeader
                      id="sub-h-imagenes"
                      panelId="sub-p-imagenes"
                      title="Imágenes"
                      done={imagenesDone}
                      open={openSub === "imagenes"}
                      onToggle={() =>
                        setOpenSub(openSub === "imagenes" ? ("" as SubId) : "imagenes")
                      }
                      description="Sube fotos de alta calidad para destacar tu propiedad."
                    />
                    <Collapse id="sub-p-imagenes" open={openSub === "imagenes"}>
                      <div className="space-y-3 pb-6">
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-muted/50 sm:py-12">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                            <Upload className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold">Arrastra tus imágenes aquí</p>
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
                          <div className="h-1 w-24 overflow-hidden rounded-full bg-muted sm:w-32">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${(imageCount / 20) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </Collapse>
          </section>

          {/* SECTION 3 — CONTACTO */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <SectionHeader
              id="sec-h-contacto"
              panelId="sec-p-contacto"
              index={3}
              title="Contacto"
              summary={contactoSummary}
              done={contactoDone}
              active={openSection === "contacto"}
              open={openSection === "contacto"}
              onToggle={() => toggleSection("contacto")}
            />
            <Collapse id="sec-p-contacto" open={openSection === "contacto"}>
              <div className="border-t border-border px-4 pb-6 pt-5 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-sm">Nombre *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3 transition-colors focus-within:border-primary">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input value={nombre} onChange={(e) => setNombre(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="Juan Pérez" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Correo *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3 transition-colors focus-within:border-primary">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input value={correo} onChange={(e) => setCorreo(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="tucorreo@ejemplo.com" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Teléfono *</Label>
                    <div className="flex items-center rounded-lg border border-border px-3 transition-colors focus-within:border-primary">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input value={tel} onChange={(e) => setTel(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="55 1234 5678" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">WhatsApp</Label>
                    <div className="flex items-center rounded-lg border border-border px-3 transition-colors focus-within:border-primary">
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
            </Collapse>
          </section>
        </main>

        {/* Live preview card */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              Vista previa del anuncio
            </div>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
              En vivo
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
            <div className="relative">
              {imagenesDone ? (
                <img
                  src={propertyPreviewImg}
                  alt="Vista previa"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-accent/40 text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-xs">Agrega imágenes para verlas aquí</p>
                </div>
              )}
              <button
                type="button"
                tabIndex={-1}
                aria-label="Guardar como favorito (referencia visual)"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-110 hover:bg-white active:scale-95"
              >
                <Heart className="h-4 w-4" />
              </button>
              {imagenesDone && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === 1 ? "w-4 bg-white" : "w-1.5 bg-white/60"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div className="flex gap-1.5">
                {tipoPropiedad && (
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                    {tipoPropiedad}
                  </span>
                )}
                {operacion && (
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                    {operacion}
                  </span>
                )}
              </div>

              <div>
                {precio ? (
                  <p
                    key={precio}
                    className="text-xl font-bold text-foreground animate-fade-in"
                  >
                    ${Number(precio).toLocaleString("es-MX")}{" "}
                    <span className="text-xs font-medium text-muted-foreground">MXN</span>
                  </p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground/50">— MXN</p>
                )}
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {direccion || "Agrega la ubicación para mostrarla aquí."}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border pt-3 text-xs text-foreground">
                <span className="inline-flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {recamaras} {recamaras === 1 ? "Recám." : "Recáms."}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {banos} {banos === 1 ? "Baño" : "Baños"}
                </span>
                {construccion && (
                  <span className="inline-flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {construccionSize} m²
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Car className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {estac} {estac === 1 ? "estacionamiento" : "estacionamientos"}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <div
                  role="button"
                  aria-disabled="true"
                  aria-label="Botón de referencia visual: Contactar"
                  tabIndex={-1}
                  className="flex-1 rounded-full border border-primary px-3 py-2 text-center text-xs font-semibold text-primary"
                >
                  Contactar
                </div>
                <div
                  role="button"
                  aria-disabled="true"
                  aria-label="Botón de referencia visual: Consultar"
                  tabIndex={-1}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Consultar
                </div>
              </div>
            </div>
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            Así verán los compradores tu anuncio. Completa los campos para mejorar su atractivo.
          </p>
        </aside>
      </div>
    </div>
  );
}
