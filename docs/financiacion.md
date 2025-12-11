# Plan de Financiación - PreguntaT

**Plataforma de Entrevistas Técnicas con IA**

**Documento:** /docs/financiacion.md  
**Criterio:** 2g) Necesidades de financiación  
**Fecha:** 11 de diciembre de 2025  
**Versión:** 1.0

---

## 📋 Tabla de Contenidos

1. [Costes Iniciales de Desarrollo](#1-costes-iniciales-de-desarrollo)
2. [Costes de Infraestructura y Servicios](#2-costes-de-infraestructura-y-servicios)
3. [Capital de Trabajo](#3-capital-de-trabajo)
4. [Costes de Marketing y Lanzamiento](#4-costes-de-marketing-y-lanzamiento)
5. [Necesidad Total de Financiación](#5-necesidad-total-de-financiación)
6. [Análisis de Fuentes de Financiación](#6-análisis-de-fuentes-de-financiación)
7. [Plan de Financiación Propuesto](#7-plan-de-financiación-propuesto)
8. [Timeline de Implementación](#8-timeline-de-implementación)

---

## 1. Costes Iniciales de Desarrollo

### 1.1 Presupuesto Calculado en 2f

El presupuesto total de desarrollo del proyecto PreguntaT, calculado según la metodología de Planning Poker con medición en Toggl Track, es de **17.675 EUR** para un equipo de 2 desarrolladores Mid-Level durante 6 sprints (6 semanas).

### 1.2 Desglose por Áreas

| Área | Horas | Costo/Hora | Total |
|------|-------|-----------|-------|
| **Backend (Node.js + Express)** | 100h | 40 EUR | 4.000 EUR |
| **Frontend (React + Vite)** | 93h | 40 EUR | 3.720 EUR |
| **Base de Datos (MongoDB)** | 8.5h | 40 EUR | 340 EUR |
| **DevOps/Docker/CI-CD** | 25h | 50 EUR | 1.250 EUR |
| **Testing/QA** | 30h | 40 EUR | 1.200 EUR |
| **Documentación (JSDoc, MD)** | 15h | 35 EUR | 525 EUR |
| **Coordinación y Overhead** | 10h | 45 EUR | 450 EUR |
| **Integración APIs Externas** | Incluido | - | - |
| **SUBTOTAL MANO DE OBRA** | **214.5h** | - | **17.160 EUR** |
| **Costes Adicionales** | - | - | **515 EUR** |
| **TOTAL DESARROLLO** | - | - | **17.675 EUR** |

### 1.3 Análisis: ¿Podemos Afrontar Esto Sin Financiación Externa?

**Respuesta: NO**

Con ahorros personales estimados de 5.000 EUR:
- **Déficit para desarrollo:** 12.675 EUR
- **Sin contar capital de trabajo:** -1.910 EUR
- **Sin contar marketing:** -2.000 EUR
- **Déficit total:** 16.585 EUR

**Conclusión:** Es necesaria financiación externa de al menos **21.585 EUR** para cubrir desarrollo, operaciones iniciales y lanzamiento del producto.

---

## 2. Costes de Infraestructura y Servicios

### 2.1 Selección de Proveedores

Basándonos en la experiencia del equipo con DigitalOcean, Render y Railway, se recomienda **DigitalOcean** por su excelente relación costo-beneficio y mayor flexibilidad.

### 2.2 Costes Mensuales Estimados

| Servicio | Proveedor | Plan | Costo Mensual |
|----------|-----------|------|--------------|
| **Hosting Backend** | DigitalOcean | Basic ($6/mes) | 5,52 EUR |
| **Hosting Frontend** | DigitalOcean/Vercel | Free/Pro | 0-25 EUR |
| **Base de Datos** | MongoDB Atlas | M1 ($57/mes) | 52,44 EUR |
| **Dominio** | TOPDOMAIN | .es | 1,25 EUR |
| **CDN** | Cloudflare | Free Plan | 0,00 EUR |
| **Email Transaccional** | SendGrid | Free (100/día) → Pro | 9,20 EUR |
| **Monitorización** | Sentry | Free Plan | 0,00 EUR |
| **Logs** | Railway/Built-in | - | 0,00 EUR |
| **TOTAL MENSUAL** | - | - | **68,41 EUR** |

### 2.3 Análisis por Servicio

#### Hosting (5,52 EUR/mes)
- **Selección:** DigitalOcean Basic Droplet
- **Especificaciones:** 1 vCPU, 1GB RAM, 25GB SSD
- **Justificación:** Suficiente para MVP, escalable si hay tracción
- **Alternativa más económica:** Railway ($30/mes) - pero menos control
- **Alternativa más cara:** AWS EC2 ($20-100/mes según uso)

#### Base de Datos (52,44 EUR/mes = $57/mes)
- **Selección:** MongoDB Atlas M1 (Shared Tier)
- **Especificaciones:** 512MB almacenamiento, 32MB sort memory, 100 ops/seg
- **Nota:** El plan gratuito (M0) está LIMITADO para producción
- **Justificación:** M1 ($57/mes) es el mínimo recomendado con SLA
- **Escalada:** M2-M10 para crecimiento

#### Email (9,20 EUR/mes = $10/mes)
- **Selección:** SendGrid Free + Pro pequeño
- **Free Plan:** 100 emails/día (suficiente para beta)
- **Pro: $9-20/mes para producción
- **Alternativa:** Mailgun, AWS SES

#### CDN (0 EUR)
- **Selección:** Cloudflare Free
- **Beneficios:** SSL gratuito, DDoS protection, caching
- **No hay coste para MVP

#### Monitorización (0 EUR)
- **Sentry Free Plan:** 5.000 errores/mes (suficiente)
- **Datadog Free:** Más limitado
- **Built-in logging:** Menos profesional

### 2.4 Costes de Infraestructura a 6 Meses

```
Período inicial (6 meses) sin ingresos:
68,41 EUR/mes × 6 meses = 410,46 EUR

Desglose:
- DigitalOcean: 33,12 EUR (6 meses)
- MongoDB Atlas: 314,64 EUR (6 meses)
- SendGrid: 55,20 EUR (6 meses)
- Dominio: 7,50 EUR (6 meses)
```

---

## 3. Capital de Trabajo

### 3.1 Necesidades de Capital de Trabajo

Durante los primeros 6 meses de operación (período hasta que se obtengan primeros ingresos), el proyecto incurrirá en gastos fijos mensuales.

### 3.2 Gastos Fijos Mensuales

| Concepto | Costo Mensual |
|----------|--------------|
| **Infraestructura y Servicios** | 68,41 EUR |
| **Licencias de Software** | 50,00 EUR |
| **Herramientas de Desarrollo** | - (reutilizar existentes) |
| **Otros Gastos Operacionales** | 200,00 EUR |
| **TOTAL MENSUAL** | **318,41 EUR** |

### 3.3 Capital de Trabajo (6 Meses)

```
318,41 EUR/mes × 6 meses = 1.910,46 EUR

Justificación:
- 6 meses sin ingresos es estándar para MVP
- Cubre costes operacionales hasta alpha/beta
- No incluye salarios (desarrolladores son equity holders)
```

### 3.4 Fondo de Emergencia Recomendado

Para mayor seguridad, se recomienda un fondo de emergencia de **3 meses adicionales**:

```
318,41 EUR/mes × 3 meses = 955,23 EUR

Financiación ampliada:
Base: 1.910,46 EUR + Emergencia: 955,23 EUR = 2.865,69 EUR
```

---

## 4. Costes de Marketing y Lanzamiento

### 4.1 Estrategia de Go-to-Market

PreguntaT es una B2B SaaS dirigida a:
- **Empresas de tecnología** (reclutadores técnicos)
- **Bootcamps de programación** (formadores)
- **Plataformas de aprendizaje** (proveedores)

### 4.2 Presupuesto de Marketing

| Concepto | Descripción | Monto |
|----------|-------------|-------|
| **Diseño de Marca** | Logo, identidad visual, colores | 800 EUR |
| **Sitio Web Marketing** | Landing page + CMS | 300 EUR |
| **Campaña Google Ads** | Search + Display (inicial) | 500 EUR |
| **Campaña Redes Sociales** | Content + ads (LinkedIn, Twitter) | 300 EUR |
| **Material de Marketing** | Presentaciones, case studies | 300 EUR |
| **Lanzamiento Beta** | Eventos, webinars, PR | 400 EUR |
| **Community Building** | Foros, Discord, networking | 200 EUR |
| **TOTAL MARKETING** | | **2.800 EUR** |

**Nota:** Presupuesto conservador. Muchas acciones iniciales serán orgánicas/DIY.

---

## 5. Necesidad Total de Financiación

### 5.1 Resumen Consolidado

| Categoría | Monto |
|-----------|-------|
| **Desarrollo** | 17.675,00 EUR |
| **Infraestructura (6 meses)** | 410,46 EUR |
| **Capital de Trabajo** | 1.910,46 EUR |
| **Marketing y Lanzamiento** | 2.800,00 EUR |
| **Fondo de Emergencia** | 955,23 EUR |
| **TOTAL NECESARIO** | **23.750,15 EUR** |

### 5.2 Rondas de Financiación Recomendadas

#### Fase 1 (MVP - Semanas 1-8)
- **Objetivo:** 17.675 EUR
- **Fuente:** Autofinanciación + Business Angels iniciales
- **Resultado:** Producto funcional, beta privado

#### Fase 2 (Beta Público - Semanas 9-16)
- **Objetivo:** 6.075 EUR
- **Fuente:** Préstamo ICO + Ingresos iniciales
- **Resultado:** Producción, primeros clientes pagados

---

## 6. Análisis de Fuentes de Financiación

A continuación se analizan **6 fuentes de financiación** aplicables a PreguntaT, con ventajas, desventajas y recomendaciones.

### 6.1 Autofinanciación (Bootstrapping)

**Descripción:** Financiar el proyecto con ahorros personales y reinvertir ganancias iniciales.

#### Ventajas
- ✅ **Control total:** Sin presión de inversores, libertad de decisión
- ✅ **Sin dilución de equity:** Mantener 100% de la empresa
- ✅ **Flexibilidad:** Pivotar rápidamente sin aprobaciones
- ✅ **Menor deuda:** No pagar intereses bancarios
- ✅ **Credibilidad:** Los inversores aman startups bootstrappeadas con tracción

#### Desventajas
- ❌ **Limitación de recursos:** Solo ~5.000 EUR disponibles
- ❌ **Velocidad:** Crecimiento lento (competidores con capital avanzan más rápido)
- ❌ **Riesgo personal:** Agotar ahorros si el proyecto fracasa
- ❌ **Insuficiente para este proyecto:** Faltan 16.585 EUR mínimo

#### Aplicabilidad a PreguntaT
**Parcial (Fase 0 - MVP básico)**
- Usar bootstrapping para desarrollar MVP muy minimalista (2-3 semanas)
- Validar problema con usuarios sin código completo
- Luego buscar financiación para producto completo

**Recomendación:** 
```
Fase 1: Bootstrapping + Business Angels (5.000 + 12.675 EUR)
Fase 2: Ingresos + Préstamo ICO (para expansión)
```

---

### 6.2 Préstamos Bancarios (ICO)

**Descripción:** Líneas de crédito del Instituto de Crédito Oficial para emprendedores.

#### Características de ICO 2025

| Característica | Valor |
|---|---|
| **Importe Máximo** | Hasta 100% del proyecto |
| **Plazo** | 1-20 años |
| **Carencia** | Hasta 3 años (sin pagar principal) |
| **Tipo de Interés** | 4-6,3% TAE máximo |
| **Avalista** | Banco intermediario (BBVA, Santander, etc.) |
| **Tiempo de Tramitación** | 2-4 semanas |

#### Ventajas
- ✅ **Financiación completa:** Hasta 23.750 EUR sin problemas
- ✅ **Bajos intereses:** 5-6% comparado con créditos privados (8-12%)
- ✅ **Carencia:** No pagar principal primeros años
- ✅ **Largo plazo:** Amortización en 10-15 años
- ✅ **Sin dilución equity:** Mantener acciones de la empresa
- ✅ **Respaldo institucional:** Mejora credibilidad ante inversores

#### Desventajas
- ❌ **Requiere aval:** Normalmente los desarrolladores personalmente
- ❌ **Historial crediticio:** Mejor si hay antecedentes positivos
- ❌ **Coste de interés:** 5.000-7.000 EUR en total (con amortización 10 años)
- ❌ **Presión de flujo:** Debe haber ingresos para pagar cuota
- ❌ **Garantías:** Puede pedirse hipoteca o avales adicionales
- ❌ **Requisitos formales:** Plan de empresa, proyecciones financieras

#### Ejemplo Numérico (ICO)

```
Préstamo solicitado: 23.750 EUR
Plazo: 10 años
Carencia de principal: 2 años
Interés: 5,5% TAE

Años 1-2: Solo intereses (~1.300 EUR/año)
Años 3-10: Cuota mensual ~260 EUR

Coste total: ~23.750 + 5.500 intereses = 29.250 EUR
```

#### Aplicabilidad a PreguntaT
**ALTAMENTE RECOMENDADO (para Fase 2)**

```
Timing:
- Meses 1-2: Bootstrapping + Angels para MVP
- Meses 3-4: Validar con usuarios, obtener tracción
- Meses 5-6: Solicitar ICO con métricas de adopción
- Meses 7-10: Ejecutar con financiación ICO

Ventaja: Si en meses 3-4 obtienes clientes pagados,
el ICO se aprobará más fácil y con menos garantías
```

---

### 6.3 Business Angels

**Descripción:** Inversores privados (personas físicas) que aportan capital, experiencia y red de contactos.

#### Características Business Angels España

| Aspecto | Valor |
|---|---|
| **Inversión Típica** | 25.000-75.000 EUR |
| **Rondas Comunes** | Pre-seed, Seed |
| **Equity Cedida** | 10-25% típicamente |
| **Benef. Fiscales** | 30% deducción en IRPF (máx. 18.000 EUR/año) |
| **Red Española** | ESADE BAN, Barcelona Angels, Madrid Angels |
| **Tiempo de Decisión** | 2-6 semanas |

#### Ventajas
- ✅ **Capital rápido:** Proceso más ágil que VC
- ✅ **Experiencia:** Mentoring valioso + red de contactos
- ✅ **Flexible:** Negocian términos caso por caso
- ✅ **Incentivos fiscales:** Inversor obtiene desgravación IRPF
- ✅ **Menos exigentes:** No requieren tanta documentación que VC
- ✅ **Aprobación rápida:** Decisiones en 2-4 semanas

#### Desventajas
- ❌ **Dilución de equity:** Ceder 10-25% de la empresa
- ❌ **Pérdida de control:** Angel típicamente busca seat en junta
- ❌ **Presión de crecimiento:** Expectativas de 5-10x ROI
- ❌ **Due diligence:** Angel querrá validar el equipo y mercado
- ❌ **Complejidad legal:** Contrato SAFI, términos de inversión
- ❌ **Riesgo personal:** Si falla, ángel puede demandar o presionar

#### Beneficios Fiscales (Angel Inversor)

```
Inversor aporta: 15.000 EUR
Deducción IRPF: 15.000 × 30% = 4.500 EUR
Ahorro fiscal: 4.500 EUR × 45% tramo IRPF = 2.025 EUR

Coste neto para inversor: 15.000 - 2.025 = 12.975 EUR
```

#### Búsqueda de Business Angels

**Redes españolas:**
- ESADE BAN (https://www.esadebusinesangels.net/)
- Barcelona Angels (https://www.barcelona-angels.com/)
- Madrid Angels
- AVAL (Asociación de Venture Capital)

**Plataformas:**
- AngelList
- Anterra
- Techcrunch Disrupt

#### Aplicabilidad a PreguntaT
**RECOMENDADO (Fase 1 - Inicial)**

```
Estrategia propuesta:
1. Buscar 1-2 business angels locales (Madrid/Barcelona)
2. Ronda de 15.000-20.000 EUR (10-15% equity)
3. Seleccionar ángeles con experiencia en:
   - SaaS/Startups tecnológicas
   - Sector de recursos humanos o educación
   - Contactos con empresas target

Ventaja adicional:
Angel + su red = acceso a primeros clientes
```

---

### 6.4 Venture Capital (VC)

**Descripción:** Fondos profesionales que invierten en startups con alto potencial de crecimiento (100x).

#### Características VC España 2025

| Aspecto | Valor |
|---|---|
| **Inversión Típica** | 250.000-500.000 EUR (Serie A+) |
| **Equity Cedida** | 20-35% (dilución más alta) |
| **Etapa Ideal** | Serie A, B, C (no para MVP) |
| **Fondos Activos (ES)** | 150+ fondos, invierten en 69% de rondas |
| **Fondos Recomendados** | BeAble, Fintlv, Korelya, OurCrowd |
| **Tiempo Evaluación** | 2-3 meses (mucho más que Angels) |

#### Ventajas
- ✅ **Capital abundante:** 250K-500K+ EUR
- ✅ **Expertise:** Equipo profesional de inversión
- ✅ **Network:** Acceso a clientes, socios, talento
- ✅ **Recursos:** Help with hiring, product, go-to-market
- ✅ **Secuela:** Facilita futuras rondas B, C
- ✅ **Visibilidad:** Portfolio de prestigio VC

#### Desventajas
- ❌ **DILUCIÓN SEVERA:** 20-35% de equity por ronda
- ❌ **Pérdida de control:** VC quiere board seats + veto power
- ❌ **Presión de crecimiento:** KPIs agresivos, objetivos trim
- ❌ **Timeline largo:** Due diligence 2-3 meses
- ❌ **No apto para MVP:** Requiere tracción, ingresos
- ❌ **Requisitos estrictos:** Plan financiero, proyecciones, traction
- ❌ **Exit pressure:** VC busca exit en 7-10 años (IPO o M&A)

#### Inversión Típica VC en España (2025)

```
Datos Observatorio de Startups (H1 2025):
- Capital invertido: 2.000M EUR
- VC participó en 69% de rondas
- Valor promedio ronda Seed: 50-100K EUR
- Valor promedio ronda A: 250K-500K EUR
- Principales fondos: Eoniq, Bonsai, JME Capital
```

#### Aplicabilidad a PreguntaT
**NO RECOMENDADO (para inicio)**

```
❌ Timing: MVP sin tracción, sin ingresos → VC no interesado
❌ Stage: VC busca startups en Series A+ (ya con 50K+ MRR)
✅ Futuro: Si validamos y crece a 30-50K EUR/mes,
   entonces SÍ solicitar Seed/Series A de VC
```

**Plan futuro:**
```
Año 1: Angels + ICO (llegar a 10-20K EUR/mes)
Año 2: Serie A de VC (si métricas lo justifican)
Año 3+: Series B, C para escala global
```

---

### 6.5 Crowdfunding

**Descripción:** Financiación colectiva desde múltiples inversores a través de plataformas online.

#### Tipos de Crowdfunding en España

| Tipo | Plataforma | Inversión | Retorno |
|------|-----------|----------|---------|
| **Recompensa** | Verkami, Kickstarter | 10-50 EUR | Producto/Acceso |
| **Préstamo (P2P)** | Growfunding, Housers | 100-1000 EUR | Interés |
| **Equity** | Companisto, Agoracrowdfunding | 500-5000 EUR | Acciones |

#### Regulación España
- **Marco legal:** Ley 5/2015 de Fomento de Financiación Empresarial
- **Autoridad:** CNMV (Comisión Nacional del Mercado de Valores)
- **Límite:** 5 millones EUR por proyecto en 12 meses
- **Plataformas autorizadas:** Todas deben estar registradas en CNMV

#### Ventajas
- ✅ **Validación de mercado:** Si recaudas, el mercado lo quiere
- ✅ **Community building:** Primeros usuarios/clientes
- ✅ **Marketing gratis:** Visibilidad media
- ✅ **Sin dilución equity:** Crowdfunding recompensa ≠ equity
- ✅ **Bajo costo:** 5% comisión plataforma
- ✅ **Feedback:** Usuarios ayudan diseño del producto

#### Desventajas
- ❌ **Muy competitivo:** 90% de proyectos no alcanzan meta
- ❌ **Timing:** Campañas toman 4-6 semanas de preparación
- ❌ **Meta pequeña:** Para PreguntaT solo sería 5-10K EUR (insuficiente)
- ❌ **Cumplimiento:** Debes entregar recompensas/acceso
- ❌ **Reputación risk:** Si fracasas, afecta marca
- ❌ **Equity dilution:** Crowdfunding equity sí diluje

#### Aplicabilidad a PreguntaT
**PARCIAL (Estrategia complementaria)**

```
Uso recomendado:
- NO como fuente principal (meta 24K EUR = poco probable)
- SÍ como validación + early users (meta 5K EUR)
- Timing: DESPUÉS de tener MVP funcional

Opción: Crowdfunding de recompensa (Verkami)
- Meta: 5.000 EUR
- Recompensas: Acceso beta gratuito, licenses anuales
- Timeline: Semana 8 (con MVP listo)
```

---

### 6.6 Aceleradoras e Incubadoras

**Descripción:** Programas que ofrecen mentoring, espacios de trabajo, conexiones y pequeña inversión.

#### Aceleradoras Españolas Relevantes

| Aceleradora | Inversión | Equity | Duración | Requisitos |
|---|---|---|---|---|
| **Lanzadera** | 0 EUR (mentoría) | 0% | 6 meses + | MVP validado |
| **SeedRocket** | 0-50K EUR | 0-5% | 3-4 meses | Early stage |
| **Conector** | 400K+ servicios | <5% | 3-4 meses | Equipo fuerte |
| **IMPACT Growth** | 250K (28 startups) | Flexible | 6 meses | Growth stage |

#### Ventajas
- ✅ **Sin costo (mentoría):** Lanzadera no toma equity
- ✅ **Mentoría experta:** Cofundadores exitosos + especialistas
- ✅ **Network:** Contactos con inversores, clientes, socios
- ✅ **Demo Day:** Presentación ante 200+ inversores
- ✅ **Infraestructura:** Oficinas, equipamiento
- ✅ **Credibilidad:** Estar en aceleradora conocida = plus
- ✅ **Pequeña inversión:** 25-50K EUR si lo hacen

#### Desventajas
- ❌ **Competitivo:** Tasa aceptación 1-5% (seleccionan pocos)
- ❌ **Tiempo:** Dedican 20-30h/semana a programa
- ❌ **Foco VC:** Aceleradoras buscan startups "de 100x"
- ❌ **Presión:** Demostrar métricas cada semana
- ❌ **Equity:** Algunos toman 5-10%
- ❌ **Conflicto horario:** Incompatible con desarrollo paralelo

#### Lanzadera - Detalles Específicos (España)

```
✅ Mejor opción para PreguntaT

Características:
- Inversión: 0 EUR (financia mentoring/infraestructura)
- Duración: 6 meses base + 5 años seguimiento
- Sede: Marina de Empresas, Valencia
- Sectores focus: Health, Sport, Education, Sustainability, RRHH ← MATCH
- Mentoría: Especialistas + modelo Calidad Total Mercadona
- Requisitos: MVP validado + equipo complementario

Proceso:
1. Solicitud (continuo, no por convocatorias)
2. Pitch ante comité (2-3 semanas)
3. Due diligence + entrevistas (2-3 semanas)
4. Decisión + Incorporación (1-2 semanas)

Timeline: 6-8 semanas total
```

#### Aplicabilidad a PreguntaT
**SÍ, RECOMENDADO (Fase 1.5)**

```
Timeline propuesto:
Semanas 1-4: Desarrollo MVP + solicitud Lanzadera
Semanas 5-8: Esperar respuesta + desarrollar
Semanas 9-14: Si aceptado → ir a Lanzadera
           → Mentoría + Demo Day
Semanas 15-18: Post-aceleradora, buscar inversión VC

Ventajas:
- Mentoría de expertos en educación/SaaS
- Networking con inversores pre-Demo Day
- Validar dirección producto con mentores
- Sin dilución de equity (clave)

Riesgos:
- Tiempo de solicitud (6-8 semanas)
- Tasa aceptación baja (pero vale la pena intentar)
```

---

## 7. Plan de Financiación Propuesto

### 7.1 Estrategia Recomendada: Híbrida Multi-Fase

Combinar **autofinanciación inicial** + **business angels** + **préstamo ICO** + **aceleradora**.

### 7.2 Ronda Inicial (Fase 1): Bootstrap + Angels

**Objetivo:** 20.000 EUR para MVP completo + 3 meses operación

#### Fuentes:

| Fuente | Monto | % Total | Plazo | Notas |
|--------|-------|---------|-------|-------|
| **Ahorros Personales** | 5.000 EUR | 25% | Inmediato | Riesgo personal limitado |
| **Business Angels** | 15.000 EUR | 75% | 3-4 semanas | 10-12% equity |
| **TOTAL FASE 1** | **20.000 EUR** | **100%** | | |

#### Desglose de Uso (Fase 1):

```
Desarrollo MVP: 17.675 EUR (88%)
Capital trabajo: 1.910 EUR (10%)
Marketing minimal: 415 EUR (2%)
```

#### Búsqueda de Business Angels:

1. **Criterios deseados:**
   - Experiencia SaaS o educación
   - Network en HR/recruiting
   - Mentalidad inversor (no especulador)
   - Ubicación España (preferente)

2. **Redes a contactar:**
   - ESADE BAN (Barcelona)
   - Madrid Angels
   - Barcelona Angels
   - Anterra
   - AngelList

3. **Pitch:**
   - "Entrevistas técnicas automatizadas con IA"
   - Problema: Screening manual toma 40% tiempo RR.HH.
   - Solución: AI hace screening en 2 minutos
   - Mercado: 100K+ HR professionals en España
   - Equipo: 2 developers Mid-level con experiencia SaaS

### 7.3 Ronda Secundaria (Fase 2): ICO + Ingresos

**Objetivo:** 6.000 EUR adicionales para expansión (meses 7-12)

#### Timing:
- **Meses 3-6:** Operar con capital Fase 1, validar con usuarios
- **Mes 6:** Solicitar ICO (con tracción = aprobación más fácil)
- **Meses 7-12:** Ejecutar con financiación ICO

#### Condiciones ICO:

```
Monto: 6.000 EUR (máximo ICO = 600.000, no hay problema)
Plazo: 10 años
Carencia: 2 años (los primeros 2 años solo intereses)
Cuota mensual (años 3-10): ~70 EUR

Coste total con intereses: 6.000 + 1.200 intereses = 7.200 EUR
```

#### Requisitos para Aprobación ICO:

- ✅ Plan de empresa (tenemos)
- ✅ Proyecciones financieras (generar)
- ✅ Traction inicial (clientes, usuarios)
- ✅ Aval: Equipo desarrolladores
- ✅ Garantía: Equipamiento (laptops, etc.) + aval personal

### 7.4 Acelerador (Fase 1.5): Lanzadera

**Timing:** Solicitar en semana 4, ejecutar en semanas 9-24

#### Beneficios:
- Mentoría especializada (educación, SaaS)
- Demo Day ante 200+ inversores
- 6 meses + 5 años seguimiento
- Sin dilución equity
- Credibilidad + visibilidad

#### Impacto en Financiación:
- Acelera aprobación ICO (credibilidad)
- Facilita Series A futuro
- Potencial pequeña inversión adicional (25-50K si impresionan)

---

## 8. Timeline de Implementación

### 8.1 Calendario Detallado (12 Meses)

```
FASE 1: BOOTSTRAP + ANGELS (Semanas 1-8)
═══════════════════════════════════════════════════════════

Semana 1-2: Preparación & Pitch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Refinir pitch deck (15 diapositivas)
□ Estimar + validar presupuesto
□ Listar 20 potenciales angels
□ Preparar materials (ppt, executive summary, financials)
⏱️ Tiempo: 30h desarrollo + 10h business
📊 Financiación: Usar bootstrapping (5.000 EUR ahorros)

Semana 3-4: Contacto con Angels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ LinkedIn/Email outreach (50+ contactos)
□ Coffee chats (objetivo: 5-10 meetings)
□ Refinir pitch basado en feedback
□ Solicitar Lanzadera (aplicación simultanea)
⏱️ Tiempo: 30h pitching + desarrollo paralelo
🎯 Objetivo: 2-3 angels con interés

Semana 5-6: Due Diligence Angels
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Conversaciones profundas (term sheet, equity %)
□ Legal: Contrato SAFI, Pacto de Socios
□ Clausulas: Vesting (4 años), liquidation preferences
□ Negociación: Buscar 10-12% max (evitar over-dilution)
□ Transferencia fondos (3-5 días hábiles)
⏱️ Tiempo: 20h legales + 40h desarrollo
💰 Cierre: 15.000 EUR en banco

Semana 7-8: Inicio Desarrollo Acelerado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Sprint 1-2 de desarrollo (40h)
□ Primeros componentes backend + frontend
□ Setup infraestructura (Docker, MongoDB Atlas)
□ CI/CD pipeline inicial
⏱️ Tiempo: 80h desarrollo (2 devs × 40h)
💾 Resultado: MVP base funcional


FASE 1.5: ACELERADOR (Semanas 4-30)
═══════════════════════════════════════════════════════════

Semana 4: Solicitud Lanzadera
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Completar formulario Lanzadera
□ Pitch video 60 segundos
□ Financial model + projections
□ Enviar aplicación
⏱️ Tiempo: 10h

Semana 6-10: Evaluación + Entrevistas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Entrevista con comité (30 min)
□ Due diligence de equipo
□ Feedback inicial
□ Decisión (aceptado/rechazado)
⏱️ Timeline: 4 semanas
🎯 Aceptación esperada: 40-50% (Lanzadera busca validación)

Semana 10-30: Programa Lanzadera (Si aceptado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Mudanza a Valencia (Marina de Empresas)
□ Mentorías semanales especializadas
□ Clases Calidad Total Mercadona
□ Reuniones con expertos (design, legal, finance)
□ Demo Day (Semana 28)
□ Pitching ante inversores
⏱️ Semanas: 21 (6 meses calendario)
💡 Aprendizaje: +100h formación
📈 Resultado: Tracción de usuarios + ingresos iniciales


FASE 2: DESARROLLO ACELERADO (Semanas 1-24)
═════════════════════════════════════════════════════════════

Sprints 1-6 (Semanas 1-24 = 6 sprints × 4 semanas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 1: Infrastructure & Auth (Semanas 1-4)
- Setup Docker, CI/CD
- Autenticación (JWT)
- Database schema
⏱️ 20h/person

Sprint 2: CRUD & State Machine (Semanas 5-8)
- Endpoints REST básicos
- Estado de entrevistas
- Primeras validaciones
⏱️ 28.5h/person

Sprint 3: IA Integration OpenAI (Semanas 9-12)
- Integración GPT-4
- Análisis automático respuestas
- Transcripción audio
⏱️ 44h/person

Sprint 4: Analytics & Reports (Semanas 13-16)
- Dashboard de métricas
- Reportes PDF
- Exportación datos
⏱️ 48.5h/person

Sprint 5: Validación & Gemini (Semanas 17-20)
- Testing exhaustivo
- Integración Gemini (redundancia)
- Performance tuning
⏱️ 32h/person

Sprint 6: Documentación & Launch (Semanas 21-24)
- Documentación completa
- GitHub Pages
- CI/CD productización
⏱️ 42h/person

💰 Total inversión Fase 2: 17.675 EUR (mano de obra)


FASE 3: ICO & ESCALADA (Meses 6-12)
═════════════════════════════════════════════════════════════

Mes 6 (Semana 25-26): Solicitud ICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Preparar documentación:
  - Plan de empresa detallado
  - Proyecciones financieras 3 años
  - Estados financieros (si los hay)
  - Traction metrics (usuarios, ingresos)
□ Cita en BBVA/Santander (ICO)
□ Entrega formulario oficial ICO
⏱️ Procesamiento: 2-4 semanas

Mes 7 (Semana 27-30): Espera Aprobación
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Due diligence banco (análisis)
□ Entrevista crediticia (posible)
□ Resolución préstamo (SÍ/NO)
□ Si aprobado: Formalización contrato
⏱️ Timeline: 2-3 semanas

Meses 8-12: Operación con ICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Capital ICO en banco (6.000 EUR)
✅ Cuota mensual apenas comienza (carencia 2 años)
✅ Gastos permitidos:
   - Marketing agresivo (2.000 EUR)
   - Contratación primera persona (si traction)
   - Infraestructura escalada
   - Producto improvements
⏱️ Duración: 5 meses

📈 Métricas esperadas (Mes 12):
   - 500+ usuarios registrados
   - 50+ empresas en beta
   - 10K+ EUR MRR (ingresos mensuales)
   - Product-market fit validado
```

### 8.2 Hitos Clave

| Semana | Hito | Status | Capital Efectivo |
|--------|------|--------|-----------------|
| 1-2 | Pitch deck ready | MVP | 5.000 EUR (bootstrap) |
| 4 | Solicitud Lanzadera | En evaluación | 5.000 EUR |
| 5-6 | Cierre ronda angels | CERRADO | 20.000 EUR ✅ |
| 8 | MVP funcional (beta) | LANZADO | 20.000 EUR |
| 10 | Decisión Lanzadera | ✅ ACEPTADO | 20.000 EUR |
| 16 | Integración OpenAI | COMPLETADA | 20.000 EUR |
| 24 | Producto v1 ready | PRODUCCIÓN | 20.000 EUR |
| 26 | Solicitud ICO | EN PROCESO | 20.000 EUR |
| 30 | Aprobación ICO | ✅ APROBADO | 26.000 EUR |
| 36 | Demo Day Lanzadera | 200+ inversores | 26.000 EUR |

---

## 9. Fuentes de Financiación: Matriz Comparativa

### 9.1 Tabla de Decisión

| Criterio | Bootstrap | Angels | ICO | VC | Crowdfunding | Acelerador |
|----------|-----------|--------|-----|----|----|-----------|
| **Velocidad fondos** | Inmediato | 3-4 sem | 4-6 sem | 8-12 sem | 6-8 sem | Integrado |
| **Monto disponible** | 5K | 15-30K | 6-100K | 250K+ | 5-10K | 0-50K |
| **Dilución equity** | 0% | 10-15% | 0% | 20-35% | 0% (reward) | 0-5% |
| **Control decisions** | ✅ Total | ⚠️ Parcial | ✅ Total | ❌ Reducido | ✅ Total | ✅ Total |
| **Mentoría/Support** | ❌ No | ✅ Sí | ❌ No | ✅ Intenso | ❌ No | ✅ Sí |
| **Red de contactos** | ❌ No | ✅ Sí | ❌ No | ✅ Sí | ⚠️ Limitada | ✅ Sí |
| **Presión de ROI** | ❌ Baja | ✅ Alta | ❌ Baja | ✅✅ Muy alta | ❌ Baja | ✅ Media |
| **Ideal para MVP** | ✅ Sí | ✅ Sí | ✅ Sí | ❌ No | ⚠️ Validación | ✅ Sí |

### 9.2 Recomendación Final

```
╔════════════════════════════════════════════════════════════╗
║        PLAN DE FINANCIACIÓN RECOMENDADO PARA PreguntaT  ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  FASE 1 (Semanas 1-8):                                    ║
║  ├─ Ahorros Personales: 5.000 EUR (25%)                  ║
║  ├─ Business Angels: 15.000 EUR (75%, ~12% equity)      ║
║  └─ TOTAL: 20.000 EUR ✅                                  ║
║                                                            ║
║  FASE 1.5 (Semanas 4-30): [Paralelo]                      ║
║  └─ Lanzadera (Mentoría + Demo Day) - Sin costo ✅       ║
║                                                            ║
║  FASE 2 (Semanas 25-30):                                  ║
║  └─ ICO Préstamo: 6.000 EUR (bajo interés, 10 años) ✅   ║
║                                                            ║
║  ═════════════════════════════════════════════════════    ║
║  TOTAL CAPITAL RECOLECTADO: 26.000 EUR                    ║
║  DILUCIÓN EQUITY: 12% (a business angels)                 ║
║  TIMELINE: 6-8 meses para capital + producto listo       ║
║                                                            ║
║  RECOMENDACIÓN: ⭐⭐⭐⭐⭐ (5/5 STARS)                      ║
║  Optimiza capital + control + mentoría + network         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 10. Justificación del Plan Propuesto

### 10.1 ¿Por Qué Este Mix de Fuentes?

**1. Bootstrap (5K EUR) - Disciplina Inicial**
- Demuestra compromiso personal
- Crea urgencia para obtener tracción
- Minimiza gasto innecesario
- Preferido por inversores serios

**2. Business Angels (15K EUR, 12%) - Rápido + Experiencia**
- Cierre en 3-4 semanas (vs VC 12 semanas)
- Mentoría + red de contactos
- Sin presión agresiva de ROI
- Tamaño ideal para MVP + primeros meses

**3. Lanzadera (0 EUR) - Mentoría + Visibilidad**
- Específicamente para educación (MATCH perfecto)
- Demo Day ante 200+ inversores potenciales
- Sin dilución equity
- Credibilidad para futuras rondas

**4. ICO (6K EUR) - Escalada Responsable**
- Solo después de validar (meses 3-6)
- Facilita con traction initial
- Bajo interés vs crédito privado
- Sin dilución equity (deuda, no equity)

### 10.2 ¿Por Qué NO Otras Alternativas?

**❌ VC completo (250K EUR):**
- Prematura sin traction
- Dilución severa (25-35%) = 3 rondas más necesarias
- Presión de crecimiento agresiva
- Incompatible con validación cuidadosa

**❌ Crowdfunding (5-10K EUR):**
- Insuficiente para 24K EUR necesarios
- Mejor como validación post-MVP (Fase 3)
- Competencia muy alta (90% fracaso)

**❌ Solo ICO/Bancos:**
- Requiere más garantías (aval personal)
- Sin mentoría + network
- Más lento para aprobación inicial

**❌ Autofinanciación pura:**
- 5K EUR insuficientes
- Crecimiento lento (competencia avanza)
- Riesgo personal elevado

---

## 11. Proyecciones Financieras (12 Meses)

### 11.1 Ingresos Proyectados

```
Mes 1-3: $0 (desarrollo, sin ingresos)
Mes 4-5: $100-200/mes (primeras pruebas gratuitas)
Mes 6: $500-1.000 (beta pagado, 5-10 clientes)
Mes 7-8: $2.000-3.000 (ramp-up después ICO)
Mes 9-12: $5.000-10.000 (crecimiento exponencial)

Proyección Mes 12:
- 100+ clientes
- 50+ empresas activas
- 10-15K EUR MRR (monthly recurring revenue)
```

### 11.2 Gastos Operacionales (12 Meses)

```
FIJOS MENSUALES (después mes 8):
- Infraestructura: 70 EUR
- Servicios SaaS: 300 EUR
- Cuota ICO: 70 EUR (desde año 3)
- Otros: 200 EUR
TOTAL FIJO: 640 EUR/mes

VARIABLES (según crecimiento):
- Marketing: 500-2.000 EUR/mes
- Hosting escalado: 100-500 EUR/mes
- API costs: 200-1.000 EUR/mes
TOTAL VARIABLE: 1.000-3.500 EUR/mes

ANUAL TOTAL (estimado): 15K-30K EUR
```

### 11.3 Break-Even Point

```
Para alcanzar break-even (ingresos = gastos):

Escenario conservador:
- Gastos mensuales: 1.500 EUR
- Precio promedio: 500 EUR/mes por cliente
- Clientes necesarios: 3

Timeline:
✅ Esperado Mes 8-10 (break-even alcanzado)
```

---

## 12. Riesgos y Mitigación

### 12.1 Tabla de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|---|---|---|
| **Angels decline** | Media (40%) | Alto | Tener 3-4 prospects en paralelo |
| **Lanzadera rejection** | Media (50%) | Bajo | Plan B: solicitar VC pequeño directamente |
| **Lento desarrollo** | Media (30%) | Medio | Reducir scope (MVP más pequeño) |
| **Sin product-market fit** | Baja (20%) | Crítico | Validar con usuarios mes 2-3 |
| **Competencia entra** | Baja (15%) | Medio | IP + velocidad (lanzar antes) |
| **ICO denegado** | Baja (10%) | Medio | Angels cover + ingresos + crowdfunding |

### 12.2 Plan B: Si Angels No Cierran

```
Si en Semana 6 no hay angels:

PLAN B:
1. Reducir scope MVP (20% features menos)
2. Extender desarrollo a 12 semanas
3. Solicitar ICO más pequeño (10K EUR)
4. Buscar micro-investors en AngelList
5. Considerar ENISA (préstamo público 25K EUR)

Timing ajustado: Mes 5-6 en lugar de Mes 3-4
```

---

## 13. Conclusiones

### 13.1 Resumen Ejecutivo

**PreguntaT necesita 23.750 EUR para MVP + lanzamiento.**

**Recomendación:**
- **Fase 1:** 20.000 EUR (Bootstrap 5K + Angels 15K)
- **Fase 2:** 6.000 EUR (ICO préstamo)
- **Paralelo:** Mentoría Lanzadera (sin costo)

**Resultado esperado (Mes 12):**
- ✅ Producto validado en producción
- ✅ 100+ usuarios / 50+ clientes
- ✅ 10-15K EUR MRR
- ✅ Break-even alcanzado
- ✅ Posición fuerte para Series A (si deseado)

### 13.2 Próximos Pasos

| Paso | Semana | Responsable | Deliverable |
|------|--------|------------|------------|
| 1. Pitch deck | 1 | PM | Presentación 15 diaps |
| 2. Angel outreach | 3 | Founders | 20+ contactos |
| 3. Cierre angels | 6 | Founders | 15K EUR en banco |
| 4. Lanzadera apply | 4 | PM | Aplicación enviada |
| 5. Desarrollo MVP | 1-8 | Devs | Producto funcional |
| 6. Metrics tracking | 6+ | PM | Dashboard KPIs |
| 7. ICO application | 26 | Founders | Documentación completa |

### 13.3 Contactos y Recursos

**Business Angels:**
- ESADE BAN: https://www.esadebusinesangels.net/
- Barcelona Angels: https://www.barcelona-angels.com/
- Madrid Angels: Network.madridangels@gmail.com
- AngelList: https://www.angel.co/

**Organismos Públicos:**
- ENISA (préstamos participativos): https://www.enisa.es/
- ICO (líneas de mediación): https://www.ico.es/

**Aceleradoras:**
- Lanzadera: https://lanzadera.org/
- SeedRocket: https://www.seedrocket.com/
- Conector: https://www.conectorstartups.com/

**Plataformas Crowdfunding:**
- Verkami: https://www.verkami.com/
- Companisto: https://www.companisto.es/

---

## 14. Apéndices

### A. Modelo de Pitch para Business Angels (30 segundos)

```
"PreguntaT automatiza el screening técnico en reclutamiento.
Ahora tarda 40% del tiempo de un recruiter hacer primeras pruebas técnicas.

Nuestra IA hace en 2 minutos lo que toman 30 minutos manual.

Mercado: 100K+ HR managers en España, 500K en Europa.

Nuestro equipo: 2 developers con 3+ años SaaS. 
Ya validamos con 50+ usuarios en beta.

Buscamos 15K EUR para lanzar como producto y 
captar primeros 100 clientes pagados en 6 meses.

¿Interesado en invertir? Café?"
```

### B. Estructura Contrato SAFI (Business Angel)

```
Elementos clave (abogado debe redactar):
✓ Participación % en sociedad
✓ Vesting 4 años (standard: 1 año cliff + 3 años)
✓ Liquidation preferences (1x non-participating)
✓ Anti-dilution rights
✓ Board seat (opcional, normalmente SÍ para 12%+)
✓ Información rights (acceso estados financieros)
✓ Drag-along rights (si vendemos, todos venden)

Coste legal: 500-800 EUR (necesario)
```

### C. Proyección Financiera Detallada (Excel)

```
Disponible en: /docs/financiacion-proyecciones.xlsx

Contiene:
- P&L (Profit & Loss) 36 meses
- Cash flow proyectado
- Análisis de sensibilidad
- Escenarios optimista/pesimista
```

---

## 📞 Contacto y Preguntas

Para dudas sobre este plan de financiación:
- **Equipo:** @Agsergio04, @pablitoclavito04
- **Email:** [a completar según proyecto]
- **GitHub:** PreguntaT Repository
- **Documento responsable:** Plan de Financiación (2g)

---

## 📝 Registro de Cambios

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 11/12/2025 | Documento inicial completo | Equipo |

---

**Documento finalizado el 11 de diciembre de 2025**

*Criterio 2g) Necesidades de Financiación - ✅ COMPLETADO*
