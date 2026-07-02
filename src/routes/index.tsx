import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Search,
  Trees,
  Waves,
  ShieldCheck,
  Building2,
  Snowflake,
  BedDouble,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

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
  | "clasificacion"
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
type AmenityGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string; // bg + text tailwind classes for the round icon badge
  visible: number; // number of chips visible before "Ver más"
  items: Amenity[];
};

const AMENITY_GROUPS: AmenityGroup[] = [
  {
    id: "exteriores",
    label: "Exteriores",
    icon: Trees,
    tint: "bg-emerald-50 text-emerald-600",
    visible: 9,
    items: [
      { id: "jardin", label: "Jardín", emoji: "🌳" },
      { id: "jardinpriv", label: "Jardín privado", emoji: "🌿" },
      { id: "terraza", label: "Terraza", emoji: "🌅" },
      { id: "terrazapriv", label: "Terraza privada", emoji: "🌄" },
      { id: "balcon", label: "Balcón", emoji: "🏙️", countable: true },
      { id: "roof", label: "Roof garden", emoji: "🌇" },
      { id: "patio", label: "Patio", emoji: "🪴" },
      { id: "patiotrasero", label: "Patio trasero", emoji: "🌾" },
      { id: "bbq", label: "Asador / BBQ", emoji: "🍖" },
    ],
  },
  {
    id: "bienestar",
    label: "Bienestar y recreación",
    icon: Waves,
    tint: "bg-sky-50 text-sky-600",
    visible: 9,
    items: [
      { id: "alberca", label: "Alberca", emoji: "🏊" },
      { id: "alberca_clima", label: "Alberca climatizada", emoji: "♨️" },
      { id: "gimnasio", label: "Gimnasio", emoji: "🏋️" },
      { id: "jacuzzi", label: "Jacuzzi", emoji: "🛁" },
      { id: "spa", label: "Spa", emoji: "💆" },
      { id: "sauna", label: "Sauna", emoji: "🧖" },
      { id: "tenis", label: "Cancha de tenis", emoji: "🎾" },
      { id: "padel", label: "Cancha de pádel", emoji: "🏓" },
      { id: "infantil", label: "Área infantil", emoji: "🧒" },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    icon: ShieldCheck,
    tint: "bg-rose-50 text-rose-600",
    visible: 8,
    items: [
      { id: "seg247", label: "Seguridad 24/7", emoji: "🛡️" },
      { id: "caseta", label: "Caseta de vigilancia", emoji: "👮" },
      { id: "acceso", label: "Acceso controlado", emoji: "🎫" },
      { id: "cctv", label: "CCTV", emoji: "📹" },
      { id: "alarma", label: "Alarma", emoji: "🚨" },
      { id: "porton", label: "Portón eléctrico", emoji: "🚧" },
      { id: "humo", label: "Detector de humo", emoji: "💨" },
      { id: "cerca", label: "Cerca eléctrica", emoji: "⚡" },
    ],
  },
  {
    id: "edificio",
    label: "Servicios del edificio",
    icon: Building2,
    tint: "bg-amber-50 text-amber-600",
    visible: 8,
    items: [
      { id: "elevador", label: "Elevador", emoji: "🛗" },
      { id: "lobby", label: "Lobby", emoji: "🛋️" },
      { id: "coworking", label: "Coworking", emoji: "💻" },
      { id: "recepcion", label: "Recepción", emoji: "🛎️" },
      { id: "planta", label: "Planta eléctrica", emoji: "⚙️" },
      { id: "cisterna", label: "Cisterna", emoji: "💧" },
      { id: "lavado", label: "Cuarto de lavado", emoji: "🧺" },
      { id: "bodega", label: "Bodega", emoji: "📦", countable: true },
    ],
  },
  {
    id: "confort",
    label: "Confort",
    icon: Snowflake,
    tint: "bg-cyan-50 text-cyan-600",
    visible: 6,
    items: [
      { id: "ac", label: "Aire acondicionado", emoji: "❄️" },
      { id: "calefaccion", label: "Calefacción", emoji: "🔥" },
      { id: "chimenea", label: "Chimenea", emoji: "🪵", countable: true },
      { id: "ventiladores", label: "Ventiladores", emoji: "🌀" },
      { id: "persianas", label: "Persianas", emoji: "🪟" },
      { id: "smart", label: "Casa inteligente", emoji: "🤖" },
    ],
  },
];


/* ---------- Amenity chip ---------- */
const AmenityChip = memo(function AmenityChip({
  item,
  count,
  onChange,
  block = false,
}: {
  item: Amenity;
  count: number;
  onChange: (n: number) => void;
  block?: boolean;
}) {
  const selected = count > 0;

  if (item.countable) {
    return (
      <div
        className={[
          "group flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm transition-all duration-200",
          block ? "w-full justify-between" : "",
          selected
            ? "border-secondary bg-secondary/10 text-foreground shadow-sm"
            : "border-border bg-card text-foreground hover:border-secondary/50 hover:bg-muted/40",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => onChange(selected ? 0 : 1)}
          className={[
            "flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 rounded-full",
            block ? "min-w-0 flex-1 justify-start text-left" : "",
          ].join(" ")}
          aria-pressed={selected}
          aria-label={selected ? `Desactivar ${item.label}` : `Activar ${item.label}`}
        >
          <span className="text-base leading-none" aria-hidden="true">{item.emoji}</span>
          <span className={`font-medium ${block ? "truncate" : ""}`}>{item.label}</span>
        </button>
        {selected && (
          <div className="ml-1 flex shrink-0 items-center gap-1.5 rounded-full bg-background/80 px-1 py-0.5 animate-fade-in">
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
        block ? "w-full justify-between" : "",
        selected
          ? "border-secondary bg-secondary/10 text-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-secondary/50 hover:bg-muted/40",
      ].join(" ")}
      aria-pressed={selected}
      aria-label={selected ? `Desactivar ${item.label}` : `Activar ${item.label}`}
    >
      <span className={`flex items-center gap-2 ${block ? "min-w-0" : ""}`}>
        <span className="text-base leading-none" aria-hidden="true">{item.emoji}</span>
        <span className={`font-medium ${block ? "truncate" : ""}`}>{item.label}</span>
      </span>
      {selected && (
        <span className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground animate-scale-in" aria-hidden="true">
          <Check className="h-2.5 w-2.5" strokeWidth={4} />
        </span>
      )}
    </button>
  );
});

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
  const [antiguedad, setAntiguedad] = useState<string>("");
  const antiguedadYears = (() => {
    const m = antiguedad.match(/^(\d+)\s*años?$/);
    return m ? Number(m[1]) : 0;
  })();

  // 2.1b — chip-style habitaciones extras
  const [walkInCloset, setWalkInCloset] = useState(2);
  const [estudio, setEstudio] = useState(1);

  // 2.1c — chip-style estacionamiento y movilidad
  const [visitas, setVisitas] = useState(1);
  const [estacTechado, setEstacTechado] = useState(0);
  const [garage, setGarage] = useState(0);
  const [cargadorEV, setCargadorEV] = useState(1);
  const [bicicletero, setBicicletero] = useState(0);

  const [terreno, setTerreno] = useState<boolean | null>(null);
  const [terrenoSize, setTerrenoSize] = useState("");
  const [construccion, setConstruccion] = useState<boolean | null>(null);
  const [construccionSize, setConstruccionSize] = useState("");
  const [jardin, setJardin] = useState<boolean | null>(null);
  const [jardinSize, setJardinSize] = useState("");

  const [usoSuelo, setUsoSuelo] = useState("Comercial");
  const [tipoRancho, setTipoRancho] = useState("Agrícola");

  // 2.2 Amenidades inline — sin selección por defecto (todas opcionales)
  const [amenities, setAmenities] = useState<Record<string, number>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [moreGroupId, setMoreGroupId] = useState<string | null>(null);
  const [moreSearch, setMoreSearch] = useState("");
  const [noAmenities, setNoAmenities] = useState(false);

  // 2.1 Characteristics — per-group collapsed state
  const [caractCollapsed, setCaractCollapsed] = useState<Record<string, boolean>>({});

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
  const clasificacionDone = !!usoSuelo;
  const propiedadDone = ubicacionDone && basicaDone && clasificacionDone;

  // Required fields: recámaras, baños completos, estacionamiento, antigüedad, niveles
  const caractDone =
    recamaras > 0 && banos > 0 && estac > 0 && !!antiguedad && niveles > 0;
  const amenidadesCount = Object.values(amenities).filter((n) => n > 0).length;
  // Debe marcar al menos una amenidad, o confirmar explícitamente que no cuenta con ninguna.
  const amenidadesDone = amenidadesCount > 0 || noAmenities;
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
      niveles > 0 ? `${niveles} ${niveles === 1 ? "nivel" : "niveles"}` : null,
    ].filter(Boolean);
    return parts.join(" · ");
  }, [recamaras, banos, construccion, construccionSize, niveles]);

  const contactoSummary = contactoDone ? `${nombre} · ${tel}` : undefined;

  /* ---------- Auto descripción ---------- */
  const autoDescripcion = useMemo(() => {
    const tipo = (tipoPropiedad || "propiedad").toLowerCase();
    const op = (operacion || "venta").toLowerCase();
    const precioNum = Number(precio);
    const precioText =
      precio && !isNaN(precioNum) && precioNum > 0
        ? `$${precioNum.toLocaleString("es-MX")} MXN`
        : null;
    const ubic = direccion?.trim() || "una excelente ubicación";

    const distribucion: string[] = [];
    if (recamaras > 0) distribucion.push(`${recamaras} ${recamaras === 1 ? "recámara" : "recámaras"}`);
    if (banos > 0) distribucion.push(`${banos} ${banos === 1 ? "baño completo" : "baños completos"}`);
    if (mediosBanos > 0) distribucion.push(`${mediosBanos} ${mediosBanos === 1 ? "medio baño" : "medios baños"}`);
    if (walkInCloset > 0) distribucion.push(`${walkInCloset} walk-in closet`);
    if (estudio > 0) distribucion.push(`${estudio === 1 ? "estudio / oficina" : `${estudio} estudios`}`);
    if (niveles > 0) distribucion.push(`distribuidos en ${niveles} ${niveles === 1 ? "nivel" : "niveles"}`);

    const movilidad: string[] = [];
    if (estac > 0) movilidad.push(`${estac} ${estac === 1 ? "cajón de estacionamiento" : "cajones de estacionamiento"}`);
    if (visitas > 0) movilidad.push(`${visitas} para visitas`);
    if (estacTechado > 0) movilidad.push("estacionamiento techado");
    if (garage > 0) movilidad.push("garage cerrado");
    if (cargadorEV > 0) movilidad.push("cargador para vehículo eléctrico");
    if (bicicletero > 0) movilidad.push("bicicletero");

    const espacios: string[] = [];
    if (terreno && terrenoSize) espacios.push(`terreno de ${terrenoSize} m²`);
    if (construccion && construccionSize) espacios.push(`${construccionSize} m² de construcción`);
    if (jardin) espacios.push(jardinSize ? `jardín de ${jardinSize} m²` : "jardín");

    const amenLabels: string[] = [];
    AMENITY_GROUPS.forEach((g) =>
      g.items.forEach((it) => {
        const c = amenities[it.id] ?? 0;
        if (c > 0) amenLabels.push(c > 1 && it.countable ? `${c} ${it.label.toLowerCase()}` : it.label.toLowerCase());
      }),
    );

    const paragraphs: string[] = [];

    paragraphs.push(
      `Descubre esta ${tipo} en ${op}${antiguedad && antiguedad !== "No estoy seguro" ? `, con antigüedad de ${antiguedad.toLowerCase()}` : ""}, ubicada en ${ubic}. Un inmueble pensado para quienes buscan comodidad, funcionalidad y una propuesta arquitectónica bien resuelta desde el primer detalle.`,
    );

    if (distribucion.length) {
      paragraphs.push(
        `La distribución ofrece ${distribucion.join(", ")}, con espacios amplios, buena iluminación natural y acabados cuidados que priorizan la calidez del día a día.`,
      );
    }

    if (espacios.length) {
      paragraphs.push(
        `En el exterior destaca ${espacios.join(", ")}, ideal para disfrutar en familia, recibir visitas o crear tus propios ambientes al aire libre.`,
      );
    }

    if (movilidad.length) {
      paragraphs.push(`Cuenta además con ${movilidad.join(", ")}, brindando practicidad y seguridad para tu movilidad diaria.`);
    }

    if (amenLabels.length) {
      paragraphs.push(
        `Entre sus amenidades y servicios encontrarás ${amenLabels.slice(0, 12).join(", ")}${amenLabels.length > 12 ? " y más" : ""}, complementando un estilo de vida integral dentro del desarrollo.`,
      );
    } else if (noAmenities) {
      paragraphs.push(
        `La propiedad se enfoca en la esencia del hogar, sin amenidades ni servicios adicionales, ofreciendo mayor privacidad, menores cuotas de mantenimiento y libertad total para adaptarla a tu estilo.`,
      );
    }

    paragraphs.push(
      `${precioText ? `Se ofrece en ${op} por ${precioText}. ` : ""}Una oportunidad inmejorable para quienes buscan una propiedad lista para habitarse en una zona con excelente plusvalía. Agenda una visita y descubre en persona todo lo que este espacio tiene para ofrecerte.`,
    );

    return paragraphs.join("\n\n");
  }, [
    tipoPropiedad,
    operacion,
    precio,
    direccion,
    antiguedad,
    recamaras,
    banos,
    mediosBanos,
    walkInCloset,
    estudio,
    niveles,
    estac,
    visitas,
    estacTechado,
    garage,
    cargadorEV,
    bicicletero,
    terreno,
    terrenoSize,
    construccion,
    construccionSize,
    jardin,
    jardinSize,
    amenities,
    noAmenities,
  ]);

  const lastAutoDescRef = useRef<string>("");
  useEffect(() => {
    setDescripcion((prev) => {
      if (prev === "" || prev === lastAutoDescRef.current) {
        lastAutoDescRef.current = autoDescripcion;
        return autoDescripcion;
      }
      lastAutoDescRef.current = autoDescripcion;
      return prev;
    });
  }, [autoDescripcion]);

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
        { id: "clasificacion", code: "1.3", label: "Clasificación", done: clasificacionDone },
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

  const setAmenity = useCallback(
    (id: string, n: number) =>
      setAmenities((cur) => {
        if ((cur[id] ?? 0) === n) return cur;
        const next = { ...cur, [id]: n };
        if (n <= 0) delete next[id];
        if (n > 0) setNoAmenities(false);
        return next;
      }),
    [],
  );

  const toggleNoAmenities = useCallback(() => {
    setNoAmenities((prev) => {
      const next = !prev;
      if (next) setAmenities({});
      return next;
    });
  }, []);

  const clearAmenityGroup = useCallback((groupId: string) => {
    setAmenities((cur) => {
      const next = { ...cur };
      const group = AMENITY_GROUPS.find((g) => g.id === groupId);
      if (!group) return cur;
      group.items.forEach((it) => delete next[it.id]);
      return next;
    });
  }, []);

  const selectAllAmenityGroup = useCallback((groupId: string) => {
    const group = AMENITY_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setAmenities((cur) => {
      const next = { ...cur };
      group.items.forEach((it) => {
        next[it.id] = 1;
      });
      return next;
    });
  }, []);

  const isAmenityGroupEmpty = useCallback(
    (groupId: string) => {
      const group = AMENITY_GROUPS.find((g) => g.id === groupId);
      if (!group) return true;
      return group.items.every((it) => (amenities[it.id] ?? 0) === 0);
    },
    [amenities],
  );

  const toggleAmenityGroup = useCallback(
    (groupId: string) => {
      if (isAmenityGroupEmpty(groupId)) selectAllAmenityGroup(groupId);
      else clearAmenityGroup(groupId);
    },
    [isAmenityGroupEmpty, selectAllAmenityGroup, clearAmenityGroup],
  );

  const clearCaractGroup = useCallback((groupId: string) => {
    switch (groupId) {
      case "detalles":
        setRecamaras(0);
        setBanos(0);
        setMediosBanos(0);
        setNiveles(0);
        setWalkInCloset(0);
        setEstudio(0);
        break;
      case "movilidad":
        setEstac(0);
        setVisitas(0);
        setEstacTechado(0);
        setGarage(0);
        setCargadorEV(0);
        setBicicletero(0);
        break;
      case "espacios":
        setTerreno(null);
        setTerrenoSize("");
        setConstruccion(null);
        setConstruccionSize("");
        setJardin(null);
        setJardinSize("");
        break;
      case "antiguedad":
        setAntiguedad("");
        break;
    }
  }, []);

  const selectAllCaractGroup = useCallback((groupId: string) => {
    switch (groupId) {
      case "detalles":
        setRecamaras(1);
        setBanos(1);
        setMediosBanos(1);
        setNiveles(1);
        setWalkInCloset(1);
        setEstudio(1);
        break;
      case "movilidad":
        setEstac(1);
        setVisitas(1);
        setEstacTechado(1);
        setGarage(1);
        setCargadorEV(1);
        setBicicletero(1);
        break;
      case "espacios":
        setTerreno(true);
        setConstruccion(true);
        setJardin(true);
        break;
      case "antiguedad":
        setAntiguedad("Nueva");
        break;
    }
  }, []);

  const isCaractGroupEmpty = useCallback(
    (groupId: string) => {
      switch (groupId) {
        case "detalles":
          return (
            recamaras === 0 &&
            banos === 0 &&
            mediosBanos === 0 &&
            niveles === 0 &&
            walkInCloset === 0 &&
            estudio === 0
          );
        case "movilidad":
          return (
            estac === 0 &&
            visitas === 0 &&
            estacTechado === 0 &&
            garage === 0 &&
            cargadorEV === 0 &&
            bicicletero === 0
          );
        case "espacios":
          return terreno === null && construccion === null && jardin === null;
        case "antiguedad":
          return !antiguedad;
        default:
          return true;
      }
    },
    [
      recamaras,
      banos,
      mediosBanos,
      walkInCloset,
      estudio,
      estac,
      visitas,
      estacTechado,
      garage,
      cargadorEV,
      bicicletero,
      terreno,
      construccion,
      jardin,
      antiguedad,
      niveles,
    ],
  );

  const toggleCaractGroup = useCallback(
    (groupId: string) => {
      if (isCaractGroupEmpty(groupId)) selectAllCaractGroup(groupId);
      else clearCaractGroup(groupId);
    },
    [isCaractGroupEmpty, selectAllCaractGroup, clearCaractGroup],
  );

  /* ---------- Características: shared body renderer (list + focus dialog) ---------- */
  type CField = { id: string; label: string; pending: boolean; span?: "full"; node: React.ReactNode };
  type CGroup = {
    id: string;
    label: string;
    desc: string;
    tint: string;
    icon: React.ComponentType<{ className?: string }>;
    layout: "grid" | "chips";
    grid?: string;
    fields: CField[];
  };

  const chipField = (
    id: string,
    label: string,
    emoji: string,
    countable: boolean,
    value: number,
    setter: (n: number) => void,
    pending: boolean = false,
  ): CField => ({
    id,
    label,
    pending,
    node: (
      <AmenityChip
        item={{ id, label, emoji, countable }}
        count={value}
        onChange={setter}
      />
    ),
  });

  const caractGroups: CGroup[] = [
    {
      id: "detalles",
      label: "Detalles",
      desc: "",
      tint: "bg-purple-50 text-purple-600",
      icon: BedDouble,
      layout: "chips",
      fields: [
        chipField("recamaras", "Recámaras", "🛏️", true, recamaras, setRecamaras, recamaras === 0),
        chipField("banos", "Baños completos", "🛁", true, banos, setBanos, banos === 0),
        chipField("medios-banos", "Medios baños", "🚿", true, mediosBanos, setMediosBanos),
        chipField("niveles", "Niveles", "🪜", true, niveles, (n) => setNiveles(Math.max(0, n)), niveles === 0),
        chipField("walkin", "Walk-in closet", "👔", true, walkInCloset, setWalkInCloset),
        chipField("estudio", "Estudio / Oficina", "💼", true, estudio, setEstudio),
      ],
    },
    {
      id: "movilidad",
      label: "Estacionamiento y movilidad",
      desc: "",
      tint: "bg-purple-50 text-purple-600",
      icon: Car,
      layout: "chips",
      fields: [
        chipField("estacionamiento", "Estacionamiento", "🚗", true, estac, setEstac, estac === 0),
        chipField("visitas", "Visitas", "🚙", true, visitas, setVisitas),
        chipField("estac-techado", "Estacionamiento techado", "🏠", false, estacTechado, setEstacTechado),
        chipField("garage", "Garage cerrado", "🚪", false, garage, setGarage),
        chipField("cargador-ev", "Cargador EV", "🔌", true, cargadorEV, setCargadorEV),
        chipField("bicicletero", "Bicicletero", "🚲", false, bicicletero, setBicicletero),
      ],
    },
    {
      id: "espacios",
      label: "Espacios exteriores",
      desc: "Responde Sí o No. Si aplica, indica la superficie en m².",
      tint: "bg-emerald-50 text-emerald-600",
      icon: Trees,
      layout: "grid",
      grid: "grid-cols-1 gap-3 sm:grid-cols-3",
      fields: [
        { id: "terreno", label: "Terreno", pending: false, node: <PresenceBlock title="Terreno" emoji="🗺️" has={terreno} onHasChange={setTerreno} value={terrenoSize} onValueChange={setTerrenoSize} fieldLabel="Tamaño del terreno" /> },
        { id: "construccion", label: "Construcción", pending: false, node: <PresenceBlock title="Construcción" emoji="🏗️" has={construccion} onHasChange={setConstruccion} value={construccionSize} onValueChange={setConstruccionSize} fieldLabel="Tamaño de construcción" /> },
        { id: "jardin", label: "Jardín", pending: false, node: <PresenceBlock title="Jardín" emoji="🌳" has={jardin} onHasChange={setJardin} value={jardinSize} onValueChange={setJardinSize} fieldLabel="Tamaño del jardín" /> },
      ],
    },
    {
      id: "antiguedad",
      label: "Antigüedad",
      desc: "Indica los años de antigüedad o si la propiedad es nueva.",
      tint: "bg-amber-50 text-amber-600",
      icon: Building2,
      layout: "chips",
      fields: [
        {
          id: "antiguedad-years",
          label: "Años de antigüedad",
          pending: !antiguedad,
          node: (
            <AmenityChip
              item={{ id: "antiguedad-years", label: "Años de antigüedad", emoji: "📅", countable: true }}
              count={antiguedad === "Nueva" || antiguedad === "No estoy seguro" ? 0 : antiguedadYears}
              onChange={(n) => {
                const clamped = Math.max(0, Math.min(150, n));
                setAntiguedad(clamped > 0 ? `${clamped} ${clamped === 1 ? "año" : "años"}` : "");
              }}
            />
          ),
        },
        {
          id: "antiguedad-nueva",
          label: "Nueva",
          pending: false,
          node: (
            <AmenityChip
              item={{ id: "antiguedad-nueva", label: "Nueva", emoji: "✨", countable: false }}
              count={antiguedad === "Nueva" ? 1 : 0}
              onChange={(n) => setAntiguedad(n > 0 ? "Nueva" : "")}
            />
          ),
        },
        {
          id: "antiguedad-nose",
          label: "No estoy segura",
          pending: false,
          node: (
            <AmenityChip
              item={{ id: "antiguedad-nose", label: "No estoy segura", emoji: "🤔", countable: false }}
              count={antiguedad === "No estoy seguro" ? 1 : 0}
              onChange={(n) => setAntiguedad(n > 0 ? "No estoy seguro" : "")}
            />
          ),
        },
      ],
    },
  ];

  const renderCaractFields = (g: CGroup, fields: CField[]) => {
    if (g.layout === "chips") {
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((f) => (
            <div key={f.id} className="[&>*]:w-full">{f.node}</div>
          ))}
        </div>
      );
    }
    return (
      <div className={`grid ${g.grid ?? ""}`}>
        {fields.map((f) => (
          <div key={f.id} className={f.span === "full" ? "sm:col-span-2" : ""}>{f.node}</div>
        ))}
      </div>
    );
  };

  const renderCaracteristicasBody = () => {
    return (
      <>
        {/* Category cards */}
        <div className="space-y-3">
          {caractGroups.map((g) => {
            const groupSelected = (() => {
              switch (g.id) {
                case "detalles":
                  return [recamaras, banos, mediosBanos, niveles, walkInCloset, estudio].filter((n) => n > 0).length;
                case "movilidad":
                  return [estac, visitas, estacTechado, garage, cargadorEV, bicicletero].filter((n) => n > 0).length;
                case "espacios":
                  return [terreno === true, construccion === true, jardin === true].filter(Boolean).length;
                case "antiguedad":
                  return !!antiguedad ? 1 : 0;
                default:
                  return 0;
              }
            })();
            const collapsed = caractCollapsed[g.id];
            const Icon = g.icon;
            return (
              <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setCaractCollapsed((c) => ({ ...c, [g.id]: !c[g.id] }))}
                    className="flex flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 rounded-lg"
                    aria-expanded={!collapsed}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${g.tint}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{g.label}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {groupSelected}
                        </span>
                      </span>
                      {g.desc && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{g.desc}</span>
                      )}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${collapsed ? "" : "rotate-180"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCaractGroup(g.id)}
                    className={[
                      "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
                      isCaractGroupEmpty(g.id)
                        ? "text-secondary hover:bg-secondary/10 hover:text-secondary"
                        : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                    ].join(" ")}
                    aria-label={isCaractGroupEmpty(g.id) ? `Seleccionar todo en ${g.label}` : `Limpiar selección de ${g.label}`}
                  >
                    {isCaractGroupEmpty(g.id) ? <Plus className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{isCaractGroupEmpty(g.id) ? "Seleccionar todo" : "Limpiar"}</span>
                  </button>
                </div>
                <Collapse id={`caract-${g.id}`} open={!collapsed}>
                  <div className="px-4 pb-4">{renderCaractFields(g, g.fields)}</div>
                </Collapse>
              </div>
            );
          })}
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
      </>
    );
  };

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

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[224px_minmax(0,1fr)_320px] lg:gap-6 lg:px-8 lg:py-8">
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
        <main className="space-y-3">
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
                              setOpenSub("clasificacion");
                            }}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
                          >
                            Guardar y continuar
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                  <div>
                    <SubHeader
                      id="sub-h-clasificacion"
                      panelId="sub-p-clasificacion"
                      title="Clasificación"
                      done={clasificacionDone}
                      open={openSub === "clasificacion"}
                      onToggle={() =>
                        setOpenSub(openSub === "clasificacion" ? ("" as SubId) : "clasificacion")
                      }
                      description="Uso de suelo y tipo de rancho."
                    />
                    <Collapse id="sub-p-clasificacion" open={openSub === "clasificacion"}>
                      <div className="space-y-4 pb-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Uso de suelo *</Label>
                            <Select value={usoSuelo} onValueChange={setUsoSuelo}>
                              <SelectTrigger className="h-10 rounded-lg">
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Habitacional">Habitacional</SelectItem>
                                <SelectItem value="Comercial">Comercial</SelectItem>
                                <SelectItem value="Mixto">Mixto</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Tipo de rancho</Label>
                            <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-background p-1">
                              {["No aplica", "Agrícola", "Ganadero"].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setTipoRancho(t)}
                                  aria-pressed={tipoRancho === t}
                                  className={[
                                    "flex-1 min-w-[80px] rounded-lg px-2 py-1.5 text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
                                    tipoRancho === t
                                      ? "bg-secondary text-secondary-foreground shadow-sm"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                  ].join(" ")}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
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
                      <div className="space-y-4 pb-6">
                        {renderCaracteristicasBody()}
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
                      <div className="space-y-4 pb-6">
                        {/* Category cards */}
                        <div className="space-y-3">
                          {AMENITY_GROUPS.map((g) => {
                            const items = g.items;
                            const activeCount = g.items.filter((it) => (amenities[it.id] ?? 0) > 0).length;
                            const collapsed = collapsedGroups[g.id];
                            const visibleN = g.visible;
                            const visibleItems = items.slice(0, visibleN);
                            const hasMore = items.length > visibleN;
                            const Icon = g.icon;
                            return (
                              <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                                <div className="flex items-center gap-3 px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => setCollapsedGroups((c) => ({ ...c, [g.id]: !c[g.id] }))}
                                    className="flex flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 rounded-lg"
                                    aria-expanded={!collapsed}
                                  >
                                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${g.tint}`}>
                                      <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                      <span className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">{g.label}</span>
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                          {activeCount}
                                        </span>
                                      </span>
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${collapsed ? "" : "rotate-180"}`} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleAmenityGroup(g.id)}
                                    className={[
                                      "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
                                      isAmenityGroupEmpty(g.id)
                                        ? "text-secondary hover:bg-secondary/10 hover:text-secondary"
                                        : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                                    ].join(" ")}
                                    aria-label={isAmenityGroupEmpty(g.id) ? `Seleccionar todo en ${g.label}` : `Limpiar selección de ${g.label}`}
                                  >
                                    {isAmenityGroupEmpty(g.id) ? <Plus className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                                    <span className="hidden sm:inline">{isAmenityGroupEmpty(g.id) ? "Seleccionar todo" : "Limpiar"}</span>
                                  </button>
                                </div>
                                <Collapse id={`amen-${g.id}`} open={!collapsed}>
                                  <div className="px-4 pb-4">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                      {visibleItems.map((it) => (
                                        <AmenityChip
                                          key={it.id}
                                          item={it}
                                          count={amenities[it.id] ?? 0}
                                          onChange={(n) => setAmenity(it.id, n)}
                                          block
                                        />
                                      ))}
                                    </div>
                                    {hasMore && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMoreGroupId(g.id);
                                          setMoreSearch("");
                                        }}
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-secondary/50 hover:text-secondary"
                                        aria-haspopup="dialog"
                                      >
                                        Ver {items.length - visibleN} más
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </Collapse>
                              </div>
                            );
                          })}
                        </div>

                        {/* Confirmación "sin amenidades" + continue */}
                        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={toggleNoAmenities}
                            aria-pressed={noAmenities}
                            disabled={amenidadesCount > 0}
                            className={[
                              "group inline-flex items-center gap-2.5 rounded-full border px-3 py-2 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
                              amenidadesCount > 0
                                ? "cursor-not-allowed border-border bg-muted/30 text-muted-foreground/60"
                                : noAmenities
                                  ? "border-secondary bg-secondary/10 text-foreground"
                                  : "border-dashed border-border bg-card text-foreground hover:border-secondary/50 hover:bg-muted/40",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                                noAmenities && amenidadesCount === 0
                                  ? "border-secondary bg-secondary text-secondary-foreground"
                                  : "border-border bg-background",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              {noAmenities && amenidadesCount === 0 && (
                                <Check className="h-3 w-3" strokeWidth={4} />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium">No cuenta con amenidades ni servicios</span>
                              <span className="block text-xs text-muted-foreground">
                                Confírmalo para continuar si no seleccionaste ninguna opción.
                              </span>
                            </span>
                          </button>
                          <Button
                            onClick={() => setOpenSub("descripcion")}
                            disabled={!amenidadesDone}
                            className="rounded-full bg-primary px-6 hover:bg-primary/90"
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
                          <Button
                            variant="outline"
                            className="rounded-full gap-2"
                            onClick={() => {
                              setDescripcion(autoDescripcion);
                              lastAutoDescRef.current = autoDescripcion;
                            }}
                          >
                            <Sparkles className="h-4 w-4 text-primary" />
                            Regenerar con tus datos
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

      {/* Amenities "Ver más" dialog */}
      {(() => {
        const g = AMENITY_GROUPS.find((x) => x.id === moreGroupId) ?? null;
        const q = moreSearch.trim().toLowerCase();
        const items = g ? (q ? g.items.filter((it) => it.label.toLowerCase().includes(q)) : g.items) : [];
        const activeInGroup = g ? g.items.filter((it) => (amenities[it.id] ?? 0) > 0).length : 0;
        const Icon = g?.icon;
        return (
          <Dialog open={!!g} onOpenChange={(o) => !o && setMoreGroupId(null)}>
            <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-2xl">
              {g && Icon && (
                <div className="flex flex-col">
                  <DialogHeader className="border-b border-border px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${g.tint}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <DialogTitle className="text-base font-semibold">{g.label}</DialogTitle>
                        <DialogDescription className="text-xs">
                          {activeInGroup} de {g.items.length} seleccionadas
                        </DialogDescription>
                      </div>
                    </div>
                    <div className="relative mt-3">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={moreSearch}
                        onChange={(e) => setMoreSearch(e.target.value)}
                        placeholder={`Buscar en ${g.label.toLowerCase()}…`}
                        className="h-10 rounded-full border-border bg-card pl-9"
                        aria-label="Buscar amenidad"
                        autoFocus
                      />
                    </div>
                  </DialogHeader>
                  <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No encontramos amenidades para "{moreSearch}".
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {items.map((it) => (
                          <AmenityChip
                            key={it.id}
                            item={it}
                            count={amenities[it.id] ?? 0}
                            onChange={(n) => setAmenity(it.id, n)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <DialogFooter className="flex-row items-center justify-between border-t border-border bg-muted/30 px-6 py-3 sm:justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setAmenities((cur) => {
                          const next = { ...cur };
                          g.items.forEach((it) => delete next[it.id]);
                          return next;
                        });
                      }}
                      className="text-xs font-medium text-muted-foreground hover:text-destructive"
                      disabled={activeInGroup === 0}
                    >
                      Limpiar categoría
                    </button>
                    <Button
                      onClick={() => setMoreGroupId(null)}
                      className="rounded-full bg-primary px-6 hover:bg-primary/90"
                    >
                      Listo
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}

    </div>
  );
}
