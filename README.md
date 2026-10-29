# Web personal · Jesús Alejandro Alzate-Grisales

Sitio estático (HTML, CSS y JS sin dependencias). Bilingüe ES/EN, modo claro y oscuro automáticos.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estilos y colores (claro y oscuro, con su contraste anotado) |
| `data/content.js` | **Textos editables**: áreas, trayectoria, congresos, distinciones, herramientas, enlaces |
| `data/publications.js` | Publicaciones (generado por el script, no editar a mano) |
| `data/publications_extra.json` | Correcciones y trabajos que no están en ORCID |
| `tools/update_publications.py` | Actualiza las publicaciones desde ORCID y Crossref |
| `js/i18n.js` | Textos de la interfaz en español e inglés |
| `js/app.js` | Publicaciones por año, búsqueda, citas APA/BibTeX, idioma y navegación |
| `assets/portrait.jpg` | Retrato |

## Actualizar las publicaciones

```bash
python3 tools/update_publications.py
```

Lee tus trabajos de ORCID, completa autores, revista y citas con Crossref, quita los preprints que ya
tienen versión publicada y escribe `data/publications.js`. Con `--dry-run` solo muestra el resultado.

Si algo sale mal o falta, edita `data/publications_extra.json`:

- `extra_dois`: DOIs que no están en tu ORCID.
- `manual`: trabajos sin DOI o todavía sin registrar (por ejemplo, un artículo aceptado).
- `exclude`: DOIs que no quieres mostrar.
- `overrides`: correcciones por DOI (`title`, `type`, `venue`, `authors`, `note`, `first`).

## Ver en local

```bash
python3 -m http.server 8765 --directory site
```

## Publicar gratis en GitHub Pages

1. Crea un repositorio llamado `jesusalzate.github.io`.
2. Sube el contenido de esta carpeta `site/` a la raíz del repositorio.
3. En Settings → Pages, elige la rama `main`. La web quedará en `https://jesusalzate.github.io`.
