import json, os, glob, unicodedata, re

def norm(s):
    return unicodedata.normalize('NFD', str(s)).encode('ascii', 'ignore').decode('utf-8').lower()

MATERIAL_ICONS = {
    'balón': '⚽', 'balon': '⚽', 'pelota': '⚽', 'pelota de tenis': '🎾',
    'cono': '🔺', 'conos': '🔺', 'semiesfera': '🟡', 'pivote': '🔺', 'seta': '🟡',
    'portería': '🥅', 'porteria': '🥅', 'miniportería': '🥅', 'miniporteria': '🥅',
    'valla': '🚧', 'pica': '📍', 'picas': '📍', 'peto': '🎽', 'petos': '🎽',
    'escalera': '🪜', 'aro': '⭕', 'cronómetro': '⏱️', 'cronometro': '⏱️',
    'pared': '🧱', 'marca': '▫️'
}

def get_icon(name):
    low = name.lower()
    for k, v in MATERIAL_ICONS.items():
        if k in low: return v
    return '📦'

ROLE_COLORS = {
    'A': '#2563EB', # Atacante: Azul
    'D': '#DC2626', # Defensa: Rojo
    'N': '#FACC15', # Neutro/Apoyo: Amarillo
    'P': '#111827', # Portero: Negro
    'E': '#CBD5E1', # Entrenador: Gris claro
}

def get_role_color(code, rol=''):
    c = code[0].upper() if code else 'A'
    if c in ROLE_COLORS:
        return ROLE_COLORS[c]
    r_norm = norm(rol)
    if 'porter' in r_norm or 'arquero' in r_norm: return ROLE_COLORS['P']
    if 'defens' in r_norm or 'oposic' in r_norm: return ROLE_COLORS['D']
    if 'comodin' in r_norm or 'apoyo' in r_norm or 'neutr' in r_norm: return ROLE_COLORS['N']
    if 'entren' in r_norm: return ROLE_COLORS['E']
    return ROLE_COLORS['A']

def clean_text(s):
    if not isinstance(s, str):
        return s
    s = re.sub(r'Aplicar la regla documentada\s*[:\-\.]?\s*', '', s, flags=re.IGNORECASE)
    return s.strip()

base_dir = '/Users/miguelperez/Documents/Codex/2026-09-09/files-mentioned-by-the-user-figuras/outputs/CampoBase_Documentos'

# Lotes de más nuevos a más antiguos (los más nuevos arriba)
lotes_desc = [
    '1001-1050',
    '951-1000',
    '901-950',
    '851-900',
    '801-850',
    '751-800',
    '701-750',
    '651-700',
    '601-650',
    '551-600',
    '501-550',
    '451-500',
    '401-450',
    '351-400',
    '301-350',
    '251-300',
    '201-250',
    '151-200'
]

exercises = []
seen_ids = set()

for lote in lotes_desc:
    lote_path = os.path.join(base_dir, lote)
    dirs = sorted([d for d in glob.glob(os.path.join(lote_path, '*')) if os.path.isdir(d) and not os.path.basename(d).startswith('.')])
    
    # En cada lote, ordenar por ID Astra o número descendente si procede
    for d in dirs:
        data_path = os.path.join(d, 'data.json')
        if not os.path.exists(data_path):
            continue
        try:
            data = json.load(open(data_path, encoding='utf-8'))
        except Exception as e:
            print(f"Error cargando {data_path}: {e}")
            continue
            
        f7_id = data.get('exercise_id') or f"f7-{os.path.basename(d).split('_')[0]}"
        if f7_id in seen_ids:
            continue
        seen_ids.add(f7_id)
        
        nombre = clean_text(data.get('nombre', ''))
        tit_fuente = data.get('titulo_explicito_en_fuente') or 'EJERCICIO'
        clasif = data.get('clasificacion') or {}
        cat_princ = clasif.get('categoria_principal') or 'Técnico-táctico'
        subcat = clasif.get('subcategoria')
        
        cat_edad = norm(data.get('categoria_edad_fuente') or '')
        formato_app = norm(clasif.get('formato_aplicacion') or '')
        tags = list(clasif.get('etiquetas') or [])
        cats_adic = list(clasif.get('categorias_adicionales') or [])
        cats_vis = list(clasif.get('categorias_visibles') or [])
        
        # Detección de etiqueta Lúdico
        all_tags_text = ' '.join([
            cat_princ,
            str(subcat or ''),
            ' '.join(tags),
            ' '.join(cats_adic),
            ' '.join(cats_vis),
            ' '.join(clasif.get('contenidos_trabajados') or []),
            nombre
        ]).lower()
        is_ludico = 'ludic' in all_tags_text or 'lúdic' in all_tags_text
        if is_ludico and 'Lúdico' not in tags:
            tags.append('Lúdico')
            
        tags_norm = [norm(t) for t in tags]
        
        # Formato de juego
        is_alevin = 'alevin' in cat_edad or any('alevin' in t for t in tags_norm)
        is_f8 = 'futbol 8' in formato_app or any('futbol 8' in t for t in tags_norm)
        is_f7_spec = ('futbol 7' in formato_app and 'general' not in formato_app) or 'futbol 7' in norm(nombre)
        is_benjamin = 'benjamin' in cat_edad or any('benjamin' in t for t in tags_norm)
        is_f11_spec = ('futbol 11' in formato_app and 'general' not in formato_app) or '8x8' in norm(nombre)
        
        if is_f11_spec:
            formato_juego = 'futbol_11'
            formatos_juego = ['futbol_11']
            format_val = 'F11'
        elif is_f7_spec or is_alevin or is_f8 or is_benjamin:
            formato_juego = 'futbol_7'
            formatos_juego = ['futbol_7']
            format_val = 'F7'
        else:
            formato_juego = 'todos'
            formatos_juego = ['futbol_7', 'futbol_11']
            format_val = 'F7'
            
        que_se_trabaja = list(clasif.get('contenidos_trabajados') or data.get('que_se_trabaja') or [])
        
        obj_gen = (data.get('objetivos') or {}).get('general')
        if isinstance(obj_gen, list) and obj_gen:
            obj_principal = obj_gen[0]
        elif isinstance(obj_gen, str) and obj_gen.strip():
            obj_principal = obj_gen.strip()
        else:
            obj_busca = data.get('que_se_busca') or []
            obj_principal = obj_busca[0] if obj_busca else nombre
            
        obj_secundarios = list((data.get('objetivos') or {}).get('tecnicos') or []) + list((data.get('objetivos') or {}).get('tacticos') or [])
        
        # Organización y roles
        org = data.get('organizacion') or {}
        num_jugadores = org.get('numero_jugadores') or org.get('jugadores_activos') or 12
        
        raw_roles = data.get('roles') or []
        mapped_roles = []
        porteros = 0
        entrenadores = 0
        for r in raw_roles:
            r_id = r.get('id', 'A1')
            r_rol = r.get('rol', 'atacante')
            r_col = get_role_color(r_id, r_rol)
            r_func = r.get('funcion') or r_rol
            r_grp = r.get('grupo') or r_rol
            mapped_roles.append({
                "id": r_id,
                "rol": r_rol,
                "color": r_col,
                "funcion": r_func,
                "posicion": r.get('posicion'),
                "grupo": r_grp
            })
            if r_id.upper().startswith('P') or 'porter' in norm(r_rol):
                porteros += 1
            if r_id.upper().startswith('E') or 'entren' in norm(r_rol):
                entrenadores += 1
                
        oposicion = org.get('oposicion')
        if not oposicion:
            has_def = any('defens' in norm(r.get('rol', '')) or r.get('id', '').upper().startswith('D') for r in raw_roles)
            oposicion = 'Con oposición' if has_def else 'Sin oposición'
            
        # Materiales
        raw_materials = data.get('materiales') or []
        mapped_materials = []
        material_names = []
        for m in raw_materials:
            m_name = (m.get('elemento') or m.get('nombre') or 'Material').strip()
            m_qty = m.get('cantidad')
            m_func = m.get('funcion') or 'Material de la tarea'
            m_icon = get_icon(m_name)
            mapped_materials.append({
                "nombre": m_name,
                "cantidad": m_qty,
                "funcion": m_func,
                "icono": m_icon
            })
            material_names.append(f"{m_qty} {m_name}" if m_qty else m_name)
            
        material_summary = ', '.join(material_names) if material_names else 'Balón'
        
        # Espacio
        espacio_data = data.get('espacio') or {}
        dims = espacio_data.get('dimensiones_fuente') or {}
        if isinstance(dims, dict) and 'largo_m' in dims and 'ancho_m' in dims:
            espacio_str = f"{dims['largo_m']} × {dims['ancho_m']} m"
        elif isinstance(dims, dict) and 'distancia_entre_jugadores_m' in dims:
            espacio_str = '5-10 m'
        else:
            espacio_str = espacio_data.get('zona_utilizada') or 'Zona de campo'
            
        # Montaje
        montaje_raw = data.get('montaje') or []
        if isinstance(montaje_raw, list):
            montaje_exp = '\n'.join(montaje_raw)
        elif isinstance(montaje_raw, dict):
            montaje_exp = montaje_raw.get('descripcion') or ''
        else:
            montaje_exp = str(montaje_raw or '')
        montaje_exp = clean_text(montaje_exp)
        if not montaje_exp:
            montaje_exp = clean_text(org.get('distribucion')) or f"Preparar la zona de trabajo de {espacio_str}."
            
        # Fases
        fases_raw = data.get('fases') or []
        como_se_hace = []
        mapped_fases = []
        for idx, f in enumerate(fases_raw):
            raw_desc = (f.get('accion') or f.get('descripcion') or '').strip()
            step_desc = clean_text(raw_desc)
            if step_desc:
                como_se_hace.append(step_desc)
                raw_next = fases_raw[idx + 1].get('accion') or fases_raw[idx + 1].get('descripcion') if idx + 1 < len(fases_raw) else "Reinicio del ejercicio según consigna."
                next_desc = clean_text(str(raw_next or ''))
                mapped_fases.append({
                    "orden": f.get('orden', idx + 1),
                    "titulo": f"Paso {f.get('orden', idx + 1)}",
                    "descripcion": step_desc,
                    "poseedor_balon": f.get('poseedor_balon'),
                    "que_ocurre_despues": next_desc,
                    "condicion_final": f.get('condicion_final')
                })
                
        if not como_se_hace:
            explicacion_raw = data.get('explicacion', '')
            if explicacion_raw:
                como_se_hace = [clean_text(s) for s in explicacion_raw.split('\n') if clean_text(s)]
            else:
                como_se_hace = [obj_principal]
                
        # Carga
        tiempos = data.get('tiempos_fuente') or {}
        dur_str = "15 min"
        if tiempos.get('duracion'):
            dur_str = f"{tiempos['duracion']} min"
        elif tiempos.get('duracion_accion_segundos'):
            dur_str = "12-15 min"
            
        carga_obj = {
            "duracion": dur_str,
            "series": "",
            "repeticiones": "",
            "descanso": None,
            "ciclo_repeticion": f"Duración de la acción: {tiempos.get('duracion_accion_segundos', [4, 6])} s. Recuperación: {tiempos.get('recuperacion_segundos', 30)} s." if tiempos.get('duracion_accion_segundos') else "Mantener continuidad de la tarea."
        }
        
        # Rotación
        rot_raw = data.get('rotaciones') or []
        has_rot = len(rot_raw) > 0 and not any('sin rotacion' in norm(r) for r in rot_raw)
        rot_exp = clean_text(rot_raw[0]) if rot_raw else "Sin rotación documentada."
        rot_obj = {
            "hay_rotacion": has_rot,
            "explicacion": rot_exp,
            "detalles": [clean_text(r) for r in rot_raw if clean_text(r)]
        }
        
        que_obs = [clean_text(q) for q in (data.get('que_debemos_observar') or []) if clean_text(q)]
        consignas = [clean_text(c) for c in (data.get('reglas') or []) if clean_text(c)]
        variantes = [clean_text(v) for v in (data.get('variantes_fuente') or []) if clean_text(v)]
        
        err_corr = []
        for c in (data.get('correcciones_fuente') or []):
            err_corr.append({"error": c, "correccion": ""})
        for c in (data.get('correcciones_editoriales') or []):
            err_corr.append({"error": c, "correccion": ""})
            
        # Leyenda visual
        leyenda_raw = data.get('leyenda') or {}
        leyenda_roles_raw = leyenda_raw.get('roles') or {}
        leyenda_jugadores = []
        if isinstance(leyenda_roles_raw, dict):
            for k_id, v_rol in leyenda_roles_raw.items():
                col = get_role_color(k_id, v_rol)
                letra = k_id[0].upper() if k_id else 'A'
                leyenda_jugadores.append({
                    "rol": v_rol,
                    "color": col,
                    "letra": letra,
                    "funcion": v_rol
                })
        if not leyenda_jugadores:
            for r in mapped_roles:
                letra = r['id'][0].upper() if r['id'] else 'A'
                leyenda_jugadores.append({
                    "rol": r['rol'],
                    "color": r['color'],
                    "letra": letra,
                    "funcion": r['funcion']
                })
                
        leyenda_acciones = []
        leyenda_acc_raw = leyenda_raw.get('acciones') or {}
        if isinstance(leyenda_acc_raw, dict):
            for k_tipo, v_nom in leyenda_acc_raw.items():
                estilo = 'discontinua' if 'discontinua' in k_tipo else 'continua'
                trazo = '- - - - ▶' if estilo == 'discontinua' else '──────▶'
                color = '#FFFFFF' if 'blanca' in k_tipo else ('#E95852' if 'roja' in k_tipo else '#429FE2')
                leyenda_acciones.append({
                    "tipo": k_tipo,
                    "nombre": v_nom,
                    "estilo": estilo,
                    "trazo": trazo,
                    "color": color,
                    "significado": v_nom
                })
        if not leyenda_acciones:
            leyenda_acciones = [
                {
                    "tipo": "linea_blanca",
                    "nombre": "Pase temporal",
                    "estilo": "continua",
                    "trazo": "──────▶",
                    "color": "#FFFFFF",
                    "significado": "Pase temporal"
                }
            ]
            
        leyenda_visual = {
            "jugadores": leyenda_jugadores,
            "materiales": [
                {
                    "nombre": m["nombre"],
                    "icono": m["icono"],
                    "cantidad": m["cantidad"],
                    "funcion": m["funcion"]
                } for m in mapped_materials
            ],
            "acciones": leyenda_acciones,
            "zonas": None
        }
        
        vista_rapida = {
            "explicacion_breve": obj_principal,
            "que_se_trabaja": que_se_trabaja,
            "material": material_summary,
            "jugadores": f"{num_jugadores} jugadores",
            "tiempo": dur_str
        }
        
        media = {
            "preview": f"library-v2/assets/previews/{f7_id}.png",
            "video": f"https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/library-v2-preview/{f7_id}/ejercicio.mp4"
        }
        
        _qa = {
            "source_folder": os.path.basename(d),
            "collection": f"Fútbol 7 ({lote})",
            "lote": lote
        }
        
        exercise_obj = {
            "id": f7_id,
            "nombre": nombre,
            "titulo_original_fuente": tit_fuente,
            "categoria": cat_princ,
            "subcategoria": subcat,
            "formato_juego": formato_juego,
            "formatos_juego": formatos_juego,
            "format": format_val,
            "etiquetas": tags,
            "categorias_adicionales": cats_adic,
            "ludico": is_ludico,
            "que_se_trabaja": que_se_trabaja,
            "objetivo_principal": obj_principal,
            "objetivos_secundarios": obj_secundarios,
            "datos_rapidos": {
                "jugadores": f"{num_jugadores} jugadores",
                "duracion": dur_str,
                "espacio": espacio_str,
                "material": material_summary
            },
            "organizacion": {
                "resumen_jugadores": f"{num_jugadores} jugadores",
                "participantes_totales": num_jugadores,
                "porteros": porteros,
                "entrenadores": entrenadores,
                "roles": mapped_roles,
                "grupos": org.get('grupos', []),
                "equipos": org.get('equipos'),
                "oposicion": oposicion
            },
            "montaje": {
                "explicacion": montaje_exp,
                "dimensiones": espacio_str,
                "espacio_tipo": espacio_data.get('zona_utilizada') or 'Zona de campo'
            },
            "materiales": mapped_materials,
            "como_se_hace": como_se_hace,
            "fases": mapped_fases,
            "carga": carga_obj,
            "rotacion": rot_obj,
            "que_observar": que_obs,
            "consignas": consignas,
            "errores_correcciones": err_corr,
            "variantes": variantes,
            "vista_rapida": vista_rapida,
            "leyenda_visual": leyenda_visual,
            "media": media,
            "_qa": _qa
        }
        
        exercises.append(exercise_obj)

print(f"Generados {len(exercises)} ejercicios de lotes 151 a 1000!")
ludicos = sum(1 for e in exercises if e.get('ludico'))
print(f"Ejercicios con marca 'ludico': {ludicos}")
print(f"Primer ejercicio (más nuevo): {exercises[0]['id']} - {exercises[0]['nombre']} (Lote: {exercises[0]['_qa']['lote']})")
print(f"Último ejercicio (más antiguo): {exercises[-1]['id']} - {exercises[-1]['nombre']} (Lote: {exercises[-1]['_qa']['lote']})")

out_file = '/Users/miguelperez/Desktop/HERMES/PrograMARIO/01_PROYECTOS/campobase/js/ejercicios-lotes-151-650.js'
with open(out_file, 'w', encoding='utf-8') as f:
    f.write("// Lotes 151 a 1000 (829 ejercicios nuevos certificados CampoBase V2)\n")
    f.write("// Ordenados de más nuevos (951-1000) a más antiguos (151-200).\n\n")
    f.write("export const LOTES_151_650_IDS = Object.freeze([\n")
    for ex in exercises:
        f.write(f"  '{ex['id']}',\n")
    f.write("]);\n\n")
    f.write("export const LOTES_151_750_IDS = LOTES_151_650_IDS;\n")
    f.write("export const LOTES_151_800_IDS = LOTES_151_650_IDS;\n")
    f.write("export const LOTES_151_1000_IDS = LOTES_151_650_IDS;\n\n")
    f.write("export const EJERCICIOS_LOTES_151_650 = Object.freeze(\n")
    json.dump(exercises, f, indent=2, ensure_ascii=False)
    f.write("\n);\n\n")
    f.write("export const EJERCICIOS_LOTES_151_750 = EJERCICIOS_LOTES_151_650;\n")
    f.write("export const EJERCICIOS_LOTES_151_800 = EJERCICIOS_LOTES_151_650;\n")
    f.write("export const EJERCICIOS_LOTES_151_1000 = EJERCICIOS_LOTES_151_650;\n")

print(f"Escrito en {out_file} ({os.path.getsize(out_file)} bytes)")
