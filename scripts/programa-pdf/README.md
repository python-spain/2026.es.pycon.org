# Generador del PDF del programa

`public/programa-pycones-2026.pdf` es la versión imprimible del programa que
se descarga desde `/es/programa/`. Se genera a partir del schedule export de
Pretalx:

```
https://pretalx.com/pycones-2026/schedule/export/schedule.json
```

Es el mismo endpoint que usa el sitio (ver `src/lib/schedule.ts`): la API REST
pública de Pretalx (`/api/events/<slug>/`) no está disponible para este evento.

## Uso

```bash
pnpm generate:programa-pdf
```

Opciones:

```bash
node scripts/generate-programa-pdf.mjs --out <ruta>   # otra ruta de salida
node scripts/generate-programa-pdf.mjs --html <ruta>  # guarda también el HTML
node scripts/generate-programa-pdf.mjs --dry-run       # no genera el PDF
```

Se necesita **Google Chrome** o Chromium instalado. Si no está en las rutas
habituales, se puede indicar con la variable de entorno `CHROME_PATH`:

```bash
CHROME_PATH=/ruta/a/chrome pnpm generate:programa-pdf
```

## Verificación

```bash
node scripts/verify-programa-pdf.mjs
```

Comprueba que el PDF contiene todas las charlas del schedule, las barras de
descanso, la geometría A4 apaisada y los colores de los tracks. Necesita
`pymupdf` en el intérprete de Python:

```bash
pip install pymupdf
PYTHON=/ruta/a/venv/bin/python node scripts/verify-programa-pdf.mjs
```

## Cómo funciona

El generador reproduce el diseño del PDF anterior:

- **Una página A4 apaisada por día**, con la cabecera (`PyConES 2026 · <día>` y
  la versión con la fecha de generación), una columna por sala y un gutter con
  las horas a la izquierda.
- **Cada charla es una tarjeta** con la franja del color de su track a la
  izquierda, la hora de inicio y fin, el badge de idioma, el título, los
  ponentes y el nombre del track.
- **Las barras horizontales** marcan la ventana de acreditaciones y las pausas.
  Pretalx no las publica como sesiones, así que se deducen de los huecos entre
  charlas. Las pausas largas (comida) se distinguen de las cortas (café) y las
  sesiones largas que acompañan el programa (el Hackathon) se ignoran al
  buscar los huecos.
- **Los colores de los tracks** se leen del propio schedule export, que es
  donde Pretalx publica los mismos colores que usa en su widget.

El eje vertical es proporcional al tiempo real, de forma que la altura de cada
tarjeta refleja la duración de la charla. Como un día más denso no cabe en una
hoja, el generador **renderiza, mide y ajusta** en un bucle:

1. Mide en el navegador cuánto espacio necesita el contenido de cada tarjeta.
2. Ajusta la densidad de la línea de tiempo para que cada hueco tenga sitio
   para su título, sus ponentes y su pie.
3. Si el día entero no cabe en la hoja, reduce la tipografía hasta que todo
   el contenido se vea.

El resultado es un PDF con el mismo aspecto que el anterior, con la tipografía
reducida en los días más densos (como hacía el generador original).
