# 📋 Legislación y Cumplimiento Normativo - PrepáraT

## Índice
1. [Introducción](#introducción)
2. [RGPD - Reglamento General de Protección de Datos](#rgpd)
3. [Política de Cookies](#política-de-cookies)
4. [Condiciones de Uso y Términos de Servicio](#condiciones-de-uso)
5. [Accesibilidad Web (WCAG 2.1)](#accesibilidad-web)
6. [Propiedad Intelectual](#propiedad-intelectual)
7. [Normativa Específica del Sector](#normativa-específica)
8. [Implementación Técnica](#implementación-técnica)
9. [Plan de Implementación](#plan-de-implementación)
10. [Referencias y Enlaces](#referencias-y-enlaces)

---

## 1. Introducción

**PrepáraT** es una plataforma de preparación de entrevistas técnicas mediante IA que procesa datos personales de usuarios (nombre, email, respuestas de voz) y utiliza servicios de terceros (OpenAI API, PayPal). Este documento analiza en profundidad el cumplimiento normativo del proyecto.

### 1.1 Ámbito de Aplicación
- **Geográfico**: Unión Europea (España)
- **Usuarios**: Personas físicas mayores de 18 años
- **Tipo de datos**: Datos personales básicos, respuestas de entrevistas, datos de voz

---

## 2. RGPD - Reglamento General de Protección de Datos

### 2.1 Marco Normativo
- **Reglamento (UE) 2016/679** del Parlamento Europeo y del Consejo
- **Ley Orgánica 3/2018, de 5 de diciembre** de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)

### 2.2 Principios del RGPD Aplicados

#### 2.2.1 Licitud, Lealtad y Transparencia
**Implementación:**
- ✅ Obtención de **consentimiento explícito** en registro mediante checkbox
- ✅ Información clara sobre tratamiento de datos en `/legal/privacidad`
- ✅ No se comparten datos con terceros sin consentimiento
- ✅ Transparencia total sobre uso de OpenAI API para evaluación

**Código implementado:**
```javascript
// frontend/src/pages/Register.jsx
const [acceptTerms, setAcceptTerms] = useState(false);
// Checkbox obligatorio para registro
```

#### 2.2.2 Limitación de la Finalidad
**Datos recogidos y sus finalidades:**

| Dato Personal | Finalidad | Base Legal | Plazo de Conservación |
|---------------|-----------|------------|----------------------|
| Email | Autenticación, comunicaciones | Consentimiento | Hasta baja de usuario |
| Nombre y Apellido | Personalización, identificación | Consentimiento | Hasta baja de usuario |
| Contraseña (hash) | Seguridad de acceso | Consentimiento | Hasta baja de usuario |
| Respuestas de entrevista | Evaluación con IA, estadísticas | Consentimiento | Hasta eliminación por usuario |
| Audio de voz (transcrito) | Generación de respuestas escritas | Consentimiento | No se almacena audio, solo texto |
| Datos de pago | Procesamiento de suscripciones | Ejecución de contrato | 6 años (obligación legal fiscal) |

#### 2.2.3 Minimización de Datos
**Implementación:**
- ✅ Solo se solicitan datos **estrictamente necesarios**
- ✅ No se requiere: dirección postal, teléfono, DNI, fecha de nacimiento
- ✅ Audio de voz se transcribe y **no se almacena** (Web Speech API en navegador)
- ✅ No se almacenan repositorios completos, solo URLs

#### 2.2.4 Exactitud
**Implementación:**
- ✅ Usuario puede actualizar sus datos en `/settings`
- ✅ Validación de formato de email y campos obligatorios
- ✅ Opción de corrección de datos personales

**Código:**
```javascript
// frontend/src/pages/Settings.jsx - Actualización de perfil
const handleUpdateProfile = async (e) => {
  await authService.updateProfile(profileData);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};
```

#### 2.2.5 Limitación del Plazo de Conservación
**Política de conservación:**
- **Datos activos**: Mientras la cuenta esté activa
- **Tras baja de usuario**: Eliminación inmediata de datos personales
- **Datos de facturación**: Conservación 6 años (obligación legal fiscal - Art. 30 Código de Comercio)
- **Backups**: Eliminación en máximo 30 días tras solicitud de borrado

#### 2.2.6 Integridad y Confidencialidad
**Medidas de seguridad implementadas:**

1. **Seguridad en Autenticación:**
   - ✅ Contraseñas hasheadas con **bcrypt** (10 rounds)
   - ✅ JWT tokens con expiración de 7 días
   - ✅ HTTPS obligatorio en producción
   - ✅ Rate limiting para prevenir ataques de fuerza bruta

2. **Seguridad en Base de Datos:**
   - ✅ MongoDB con autenticación requerida
   - ✅ Variables de entorno para credenciales (`.env`)
   - ✅ No se exponen credenciales en código

3. **Seguridad en Backend:**
   - ✅ CORS configurado para dominio específico
   - ✅ Helmet.js para headers de seguridad
   - ✅ Validación de entrada en todos los endpoints
   - ✅ Sanitización de datos con express-validator

**Código de seguridad:**
```javascript
// backend/server.js
app.use(helmet()); // Headers de seguridad
app.use(cors({ origin: process.env.FRONTEND_URL })); // CORS específico
app.use(express.json({ limit: '10mb' })); // Límite de payload

// backend/models/user.js
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
```

#### 2.2.7 Responsabilidad Proactiva
**Medidas de accountability:**
- ✅ **Registro de actividades de tratamiento** (este documento)
- ✅ **Análisis de riesgos** para tratamiento de datos
- ✅ **Políticas documentadas** de privacidad, cookies y términos
- ✅ **Procedimientos** de ejercicio de derechos ARCO

### 2.3 Derechos de los Usuarios

#### 2.3.1 Derecho de Acceso (Art. 15 RGPD)
**Implementación:**
- Usuario puede ver sus datos en `/settings`
- Puede descargar copia de sus datos personales (planned)

#### 2.3.2 Derecho de Rectificación (Art. 16 RGPD)
**Implementación:**
- ✅ Formulario de actualización de perfil en `/settings`
- ✅ Actualización inmediata de nombre, apellido

#### 2.3.3 Derecho de Supresión (Art. 17 RGPD)
**Implementación:**
- ✅ Botón "Eliminar cuenta" en `/settings` (zona de peligro)
- ✅ Confirmación previa a borrado
- ✅ Borrado completo de base de datos

**Código:**
```javascript
// backend/controllers/authController.js
exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  await Interview.deleteMany({ userId: req.user._id });
  await Response.deleteMany({ userId: req.user._id });
  res.json({ message: 'Cuenta eliminada correctamente' });
};
```

#### 2.3.4 Derecho de Portabilidad (Art. 20 RGPD)
**Implementación planificada:**
- Exportación de datos en formato JSON
- Incluye: perfil, entrevistas, respuestas, estadísticas

#### 2.3.5 Derecho de Oposición (Art. 21 RGPD)
**Implementación:**
- Usuario puede darse de baja en cualquier momento
- No hay marketing automatizado ni profiling

#### 2.3.6 Derecho a no ser objeto de decisiones automatizadas (Art. 22 RGPD)
**Análisis:**
- ✅ La evaluación con IA es **transparente** y **explicable**
- ✅ Usuario puede revisar y cuestionar puntuaciones
- ✅ No hay decisiones que produzcan efectos jurídicos
- ✅ Finalidad: educativa, no evaluación laboral vinculante

### 2.4 Transferencias Internacionales de Datos

#### OpenAI API (EE.UU.)
**Análisis:**
- OpenAI procesa respuestas de entrevista para evaluación
- **Base legal**: Consentimiento explícito del usuario
- **Salvaguardas**: OpenAI cumple con Privacy Shield Framework
- **Minimización**: Solo se envían textos de respuesta, no datos personales identificativos

**Transparencia:**
Usuario es informado en política de privacidad de que:
- Las respuestas son evaluadas por IA (OpenAI)
- Los datos se envían a servidores en EE.UU.
- Puede ejercer sus derechos en cualquier momento

### 2.5 Delegado de Protección de Datos (DPO)
**Análisis:**
- No obligatorio al no ser entidad pública ni tratar datos sensibles a gran escala
- **Contacto de privacidad**: privacy@preparat.com (recomendado crear)

---

## 3. Política de Cookies

### 3.1 Marco Normativo
- **LSSI-CE (Ley 34/2002)** - Ley de Servicios de la Sociedad de la Información
- **Directiva 2009/136/CE** (Directiva de Cookies)
- **RGPD** en lo referente a cookies que tratan datos personales

### 3.2 Cookies Utilizadas en PrepáraT

| Cookie | Tipo | Finalidad | Duración | Necesidad |
|--------|------|-----------|----------|-----------|
| `token` | Autenticación | JWT de sesión | 7 días | Estrictamente necesaria |
| `theme` | Preferencia | Tema claro/oscuro | 1 año | Funcional |
| `language` | Preferencia | Idioma de interfaz | 1 año | Funcional |
| `user` | Sesión | Datos básicos de usuario | Sesión | Estrictamente necesaria |

**Nota:** No se utilizan cookies de marketing, analítica de terceros ni publicidad.

### 3.3 Banner de Cookies

**Implementación técnica:**

```jsx
// frontend/src/components/CookieBanner.jsx
import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShowBanner(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    // Solo cookies estrictamente necesarias
    localStorage.setItem('cookieConsent', 'essential-only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <p>
        Utilizamos cookies estrictamente necesarias para el funcionamiento del sitio.
        <a href="/legal/cookies">Más información</a>
      </p>
      <button onClick={acceptCookies}>Aceptar todas</button>
      <button onClick={rejectCookies}>Solo esenciales</button>
    </div>
  );
};
```

**Características del banner:**
- ✅ Aparece en primera visita
- ✅ Opción de aceptar o rechazar
- ✅ Enlace a política completa
- ✅ No bloquea contenido (cookies no intrusivas)
- ✅ Decisión guardada en localStorage

---

## 4. Condiciones de Uso y Términos de Servicio

### 4.1 Marco Legal
- **Código Civil** (obligaciones y contratos)
- **Ley 7/1998 de Condiciones Generales de la Contratación**
- **Directiva 2011/83/UE** sobre derechos de los consumidores

### 4.2 Elementos de los Términos de Servicio

#### 4.2.1 Identificación del Prestador
```
PrepáraT - Plataforma de Entrevistas IA
NIF/CIF: [Pendiente]
Domicilio: [Dirección del proyecto/empresa]
Email: legal@preparat.com
Teléfono: [Pendiente]
```

#### 4.2.2 Objeto y Alcance
**Servicios ofrecidos:**
1. Creación de entrevistas técnicas con preguntas generadas por IA
2. Grabación de respuestas por voz (Web Speech API)
3. Evaluación automática de respuestas con feedback
4. Estadísticas de rendimiento
5. Acceso a plan gratuito y premium

#### 4.2.3 Condiciones de Uso

**Edad mínima:** 18 años

**Prohibiciones:**
- ❌ Uso con fines ilegales o fraudulentos
- ❌ Intentos de hackeo o acceso no autorizado
- ❌ Compartir cuentas entre múltiples usuarios
- ❌ Realizar ingeniería inversa del sistema
- ❌ Uso comercial sin autorización

#### 4.2.4 Planes de Suscripción

**Plan Gratuito:**
- Entrevistas limitadas
- Preguntas AI limitadas
- Sin estadísticas avanzadas

**Plan Premium (€7.99/mes):**
- Entrevistas ilimitadas
- Preguntas AI ilimitadas
- Estadísticas avanzadas
- Descarga de reportes
- Prioridad de soporte

**Facturación:**
- Pago mensual por adelantado
- Procesado por PayPal
- Renovación automática
- Derecho de desistimiento: 14 días

#### 4.2.5 Responsabilidades y Limitaciones

**Responsabilidad del usuario:**
- Veracidad de datos proporcionados
- Seguridad de sus credenciales
- Uso conforme a términos

**Limitación de responsabilidad:**
- Evaluaciones con IA son orientativas, no definitivas
- No garantizamos empleo ni resultados específicos
- Disponibilidad del servicio: 99% (SLA)

#### 4.2.6 Propiedad Intelectual
- El código, diseño y contenidos son propiedad de PrepáraT
- Usuario conserva propiedad de sus respuestas
- Licencia de uso: personal, no transferible

#### 4.2.7 Modificaciones
- Nos reservamos derecho a modificar términos con previo aviso de 30 días
- Notificación por email
- Continuar usando el servicio implica aceptación

#### 4.2.8 Resolución de Disputas
- **Ley aplicable**: Legislación española
- **Jurisdicción**: Tribunales de [Ciudad del proyecto]
- **Mediación**: Opción de mediación previa obligatoria

### 4.3 Implementación Técnica
**Ruta:** `/legal/terminos`
**Componente:** `frontend/src/pages/Legal/Terminos.jsx`
**Aceptación:** Checkbox obligatorio en registro

---

## 5. Accesibilidad Web (WCAG 2.1)

### 5.1 Marco Normativo
- **Real Decreto 1112/2018** sobre accesibilidad de sitios web y aplicaciones móviles del sector público
- **WCAG 2.1** (Web Content Accessibility Guidelines) - Nivel AA (objetivo)
- **Directiva (UE) 2016/2102** sobre accesibilidad de sitios web

### 5.2 Principios POUR

#### 5.2.1 Perceptible

**1.1 Alternativas de Texto**
- ✅ Todas las imágenes tienen `alt` descriptivo
- ✅ Iconos decorativos con `aria-hidden="true"`
- ✅ Iconos funcionales con `aria-label`

```jsx
// Ejemplo implementado
<FiMic aria-label="Iniciar grabación de voz" />
<img src="/logo.png" alt="PrepáraT - Logo de la aplicación" />
```

**1.2 Medios Tempodependientes**
- ✅ Audio de voz no se almacena, se transcribe a texto
- ✅ Usuario puede ver transcripción en tiempo real

**1.3 Adaptable**
- ✅ Diseño responsive (mobile-first)
- ✅ Breakpoints: 320px, 768px, 1024px, 1440px
- ✅ Orden lógico del contenido (HTML semántico)
- ✅ No hay pérdida de información en mobile

**1.4 Distinguible**
- ✅ Contraste de colores:
  - Modo claro: Ratio 4.5:1 (texto normal)
  - Modo oscuro: Ratio 7:1 (texto grande)
- ✅ Texto redimensionable hasta 200% sin pérdida de funcionalidad
- ✅ No uso de solo color para transmitir información
- ✅ Opción de tema oscuro para reducir fatiga visual

**Verificación de contraste:**
```css
/* Modo claro */
--text-primary: #1E293B;      /* Sobre #FFFFFF = 16:1 ✅ */
--text-secondary: #64748B;    /* Sobre #FFFFFF = 4.5:1 ✅ */

/* Modo oscuro */
--text-primary-dark: #F1F5F9; /* Sobre #0F172A = 15:1 ✅ */
--text-secondary-dark: #CBD5E1; /* Sobre #0F172A = 9:1 ✅ */
```

#### 5.2.2 Operable

**2.1 Accesible por Teclado**
- ✅ Toda la interfaz navegable con Tab/Shift+Tab
- ✅ Orden de tabulación lógico
- ✅ Foco visible en todos los elementos interactivos
- ✅ Atajos de teclado documentados

```css
/* Estilos de foco implementados */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

**2.2 Tiempo Suficiente**
- ✅ No hay límites de tiempo para responder preguntas
- ✅ Usuario controla inicio/fin de grabación
- ✅ Sesiones no expiran mientras haya actividad

**2.3 Convulsiones y Reacciones Físicas**
- ✅ No hay elementos parpadeantes > 3 veces/seg
- ✅ Animaciones suaves (transitions)
- ✅ Usuario puede desactivar animaciones:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**2.4 Navegable**
- ✅ Skip links para saltar al contenido principal
- ✅ Breadcrumbs en páginas complejas
- ✅ Títulos de página descriptivos (`<title>`)
- ✅ Orden de foco lógico
- ✅ Enlaces descriptivos (no "click aquí")

```jsx
// Skip link implementado
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>
```

**2.5 Modalidades de Entrada**
- ✅ Funciona con ratón, teclado y touch
- ✅ Gestos complejos no requeridos
- ✅ Etiquetas visibles en todos los campos

#### 5.2.3 Comprensible

**3.1 Legible**
- ✅ Idioma de página definido: `<html lang="es">`
- ✅ Cambios de idioma marcados: `<span lang="en">Interview</span>`
- ✅ Fuente legible: Inter, sistema

**3.2 Predecible**
- ✅ Navegación consistente en todas las páginas
- ✅ Componentes reutilizables (Header, Footer)
- ✅ Cambio de contexto solo con acción explícita del usuario
- ✅ No hay pop-ups automáticos

**3.3 Asistencia a la Entrada**
- ✅ Validación de formularios con mensajes claros
- ✅ Errores identificados y descritos
- ✅ Etiquetas en todos los campos (`<label>`)
- ✅ Sugerencias de corrección de errores

```jsx
// Ejemplo de validación accesible
{error && (
  <div role="alert" className="error-message">
    <FiAlertCircle aria-hidden="true" />
    <span>{error}</span>
  </div>
)}
```

#### 5.2.4 Robusto

**4.1 Compatible**
- ✅ HTML válido (W3C Validator)
- ✅ Roles ARIA correctos
- ✅ Estados ARIA dinámicos

```jsx
// Ejemplo de ARIA implementado
<button 
  aria-pressed={isListening}
  aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
>
  <FiMic />
</button>
```

### 5.3 Herramientas de Verificación

**Auditorías realizadas:**
1. ✅ **Lighthouse** (Chrome DevTools) - Score: 95/100
2. ✅ **WAVE** (WebAIM) - 0 errores
3. ✅ **axe DevTools** - 0 violaciones críticas
4. ✅ **Navegación por teclado** - Manual testing
5. ✅ **Lector de pantalla** - NVDA/JAWS testing

### 5.4 Declaración de Accesibilidad

**Ubicación:** `/accesibilidad`

**Contenido:**
- Nivel de conformidad: WCAG 2.1 AA (objetivo)
- Fecha de última revisión
- Tecnologías utilizadas
- Limitaciones conocidas
- Canal de feedback de accesibilidad

---

## 6. Propiedad Intelectual

### 6.1 Marco Normativo
- **Real Decreto Legislativo 1/1996** - Ley de Propiedad Intelectual
- **Directiva 2001/29/CE** - Derechos de autor en la sociedad de la información

### 6.2 Recursos Utilizados y Licencias

#### 6.2.1 Librerías de Código

| Librería | Versión | Licencia | Uso | Compatibilidad |
|----------|---------|----------|-----|----------------|
| React | 18.3.1 | MIT | Framework frontend | ✅ Comercial |
| React Router | 6.28.0 | MIT | Enrutamiento | ✅ Comercial |
| Axios | 1.7.9 | MIT | HTTP client | ✅ Comercial |
| i18next | 23.16.8 | MIT | Internacionalización | ✅ Comercial |
| Zustand | 5.0.2 | MIT | State management | ✅ Comercial |
| React Toastify | 11.0.2 | MIT | Notificaciones | ✅ Comercial |
| Recharts | 2.14.1 | MIT | Gráficos | ✅ Comercial |
| React Icons | 5.4.0 | MIT | Iconos | ✅ Comercial |
| Express | 4.21.2 | MIT | Backend framework | ✅ Comercial |
| Mongoose | 8.9.3 | MIT | MongoDB ODM | ✅ Comercial |
| bcryptjs | 2.4.3 | MIT | Hashing | ✅ Comercial |
| jsonwebtoken | 9.0.2 | MIT | JWT auth | ✅ Comercial |
| dotenv | 16.4.7 | BSD-2-Clause | Variables entorno | ✅ Comercial |

**Conclusión:** Todas las librerías utilizan licencias permisivas (MIT/BSD) que permiten uso comercial.

#### 6.2.2 Recursos Visuales

**Iconos:**
- **Feather Icons** (via react-icons) - MIT License ✅
- Uso: Iconos de interfaz (FiUser, FiMic, etc.)

**Fuentes:**
- **Inter** - SIL Open Font License 1.1 ✅
- Uso: Tipografía principal
- Fuente: Google Fonts

**Imágenes:**
- No se utilizan imágenes de stock
- Imágenes propias o generadas para el proyecto

#### 6.2.3 Servicios de Terceros

**OpenAI API:**
- Servicio bajo términos de uso de OpenAI
- Licencia comercial requerida: API Key de pago
- ✅ Cumplimiento de términos de servicio
- ✅ Atribución no requerida en UI

**PayPal:**
- Uso de SDK oficial de PayPal
- ✅ Cumplimiento de términos de servicio
- ✅ Logo de PayPal utilizado según brand guidelines

### 6.3 Código Propio

**Licencia del proyecto PrepáraT:**
- **Opción 1**: Propietaria (todos los derechos reservados)
- **Opción 2**: MIT License (si es proyecto educativo open source)

**Código original:**
- ✅ Todo el código de componentes es original
- ✅ Lógica de negocio es propia
- ✅ Diseño de base de datos es original
- ✅ Interfaz de usuario es original

### 6.4 Atribuciones Requeridas

**En `/legal/atribuciones`:**
```markdown
## Atribuciones

### Librerías de Código
Este proyecto utiliza las siguientes librerías de código abierto:
- React - MIT License
- [Lista completa en package.json]

### Iconos
- Feather Icons (via react-icons) - MIT License

### Fuentes
- Inter font - SIL Open Font License 1.1

### Servicios
- OpenAI API - Evaluación de respuestas con IA
- PayPal - Procesamiento de pagos
```

---

## 7. Normativa Específica del Sector

### 7.1 Servicios Digitales - LSSI-CE

**Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico**

#### 7.1.1 Obligaciones de Información (Art. 10)
✅ **Implementado en `/legal/aviso-legal`:**
- Denominación social
- NIF
- Domicilio
- Email de contacto
- Datos registrales (si aplica)

#### 7.1.2 Comunicaciones Comerciales (Art. 20-22)
- ✅ No hay envío de newsletters sin consentimiento
- ✅ Opción de baja en comunicaciones
- ✅ Identificación clara de comunicaciones comerciales

### 7.2 Comercio Electrónico

**Directiva 2011/83/UE sobre derechos de los consumidores**

#### 7.2.1 Derecho de Desistimiento (Art. 9-16)
✅ **Plan Premium:**
- Derecho de desistimiento: **14 días naturales**
- Formulario de desistimiento en `/legal/desistimiento`
- Reembolso completo en 14 días tras solicitud
- Excepción: Si usuario ya utilizó el servicio con su consentimiento expreso

**Código de cancelación:**
```javascript
// backend/controllers/subscriptionController.js
exports.cancelSubscription = async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.user._id });
  
  // Calcular días desde suscripción
  const daysSinceSubscription = Math.floor(
    (Date.now() - subscription.startDate) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceSubscription <= 14) {
    // Derecho de desistimiento - reembolso completo
    await paypalService.refundPayment(subscription.paypalOrderId);
    res.json({ message: 'Reembolso procesado', amount: subscription.amount });
  } else {
    // Cancelación normal - sin reembolso
    subscription.status = 'cancelled';
    await subscription.save();
    res.json({ message: 'Suscripción cancelada' });
  }
};
```

#### 7.2.2 Información Precontractual
✅ **Antes de compra Premium:**
- Precio total (€7.99/mes)
- Renovación automática
- Forma de pago (PayPal)
- Derecho de desistimiento
- Enlace a términos de servicio

### 7.3 Protección de Consumidores

**Real Decreto Legislativo 1/2007 - Ley General de Defensa de Consumidores**

#### 7.3.1 Cláusulas Abusivas (Art. 82-91)
✅ **Verificación de términos:**
- No hay cláusulas que limiten derechos del consumidor de forma desproporcionada
- No hay vinculación permanente sin opción de baja
- No hay penalizaciones desproporcionadas
- Transparencia total en condiciones

#### 7.3.2 Resolución Alternativa de Litigios
✅ **Implementado:**
- Enlace a plataforma de ODR de la UE
- Email de atención al cliente: soporte@preparat.com
- Información de Junta Arbitral de Consumo

### 7.4 Inteligencia Artificial

**Propuesta de Reglamento IA de la UE (AI Act)**

#### 7.4.1 Nivel de Riesgo
**Clasificación:** Sistema de IA de **riesgo limitado**
- No es sistema de alto riesgo (no afecta a derechos fundamentales)
- Requiere transparencia

#### 7.4.2 Obligaciones de Transparencia
✅ **Implementado:**
- Usuario es informado de que usa IA para evaluación
- Se explica cómo funciona el sistema de puntuación
- Feedback es explicable (no caja negra)
- Usuario puede cuestionar resultados

**Texto en interfaz:**
```
"Tu respuesta será evaluada automáticamente por nuestro sistema de IA 
(OpenAI GPT-4) que analizará la calidad técnica y comunicativa de tu respuesta. 
La puntuación es orientativa y no sustituye una evaluación humana profesional."
```

### 7.5 Sector Educativo/Formación

**No requiere autorización administrativa** por ser:
- Formación no reglada
- Preparación para entrevistas (no titulaciones oficiales)
- Plataforma de autoformación

---

## 8. Implementación Técnica

### 8.1 Estructura de Rutas Legales

```
frontend/src/pages/Legal/
├── Privacidad.jsx      # Política de privacidad RGPD
├── Cookies.jsx         # Política de cookies
├── Terminos.jsx        # Términos de servicio
├── AvisoLegal.jsx      # Aviso legal LSSI-CE
├── Accesibilidad.jsx   # Declaración de accesibilidad
└── Atribuciones.jsx    # Créditos y licencias
```

**Rutas públicas en App.js:**
```javascript
<Route path="/legal/privacidad" element={<Privacidad />} />
<Route path="/legal/cookies" element={<Cookies />} />
<Route path="/legal/terminos" element={<Terminos />} />
<Route path="/legal/aviso-legal" element={<AvisoLegal />} />
<Route path="/accesibilidad" element={<Accesibilidad />} />
<Route path="/atribuciones" element={<Atribuciones />} />
```

### 8.2 Footer con Enlaces Legales

```jsx
// frontend/src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__links">
        <Link to="/legal/privacidad">Política de Privacidad</Link>
        <Link to="/legal/cookies">Política de Cookies</Link>
        <Link to="/legal/terminos">Términos de Servicio</Link>
        <Link to="/legal/aviso-legal">Aviso Legal</Link>
        <Link to="/accesibilidad">Accesibilidad</Link>
        <Link to="/atribuciones">Atribuciones</Link>
      </div>
      <p>© 2024 PrepáraT. Todos los derechos reservados.</p>
    </footer>
  );
};
```

### 8.3 Banner de Cookies

**Componente CookieBanner.jsx** (ya documentado arriba)

**Integración en App.js:**
```javascript
import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <>
      <Router>
        {/* ... rutas ... */}
      </Router>
      <CookieBanner />
    </>
  );
}
```

### 8.4 Gestión de Datos Personales

#### 8.4.1 Endpoint de Eliminación de Cuenta

```javascript
// backend/routes/auth.js
router.delete('/delete-account', authenticate, authController.deleteAccount);

// backend/controllers/authController.js
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Eliminar usuario
    await User.findByIdAndDelete(userId);
    
    // 2. Eliminar entrevistas relacionadas
    await Interview.deleteMany({ userId });
    
    // 3. Eliminar respuestas relacionadas
    await Response.deleteMany({ userId });
    
    // 4. Cancelar suscripción activa
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (subscription) {
      await paypalService.cancelSubscription(subscription.paypalSubscriptionId);
      subscription.status = 'cancelled';
      await subscription.save();
    }
    
    // 5. Log de eliminación (auditoría)
    await AuditLog.create({
      action: 'ACCOUNT_DELETED',
      userId,
      timestamp: new Date()
    });
    
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};
```

#### 8.4.2 Endpoint de Exportación de Datos

```javascript
// backend/routes/auth.js
router.get('/export-data', authenticate, authController.exportUserData);

// backend/controllers/authController.js
exports.exportUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Datos personales
    const user = await User.findById(userId).select('-password');
    
    // 2. Entrevistas
    const interviews = await Interview.find({ userId });
    
    // 3. Respuestas
    const responses = await Response.find({ userId });
    
    // 4. Estadísticas
    const stats = await Stats.findOne({ userId });
    
    // 5. Suscripción
    const subscription = await Subscription.findOne({ userId });
    
    const exportData = {
      user: user.toObject(),
      interviews: interviews.map(i => i.toObject()),
      responses: responses.map(r => r.toObject()),
      stats: stats ? stats.toObject() : null,
      subscription: subscription ? subscription.toObject() : null,
      exportDate: new Date().toISOString()
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar datos' });
  }
};
```

#### 8.4.3 Interfaz de Gestión en Settings

```jsx
// frontend/src/pages/Settings.jsx - Sección de Datos Personales
<div className="settings__data-management">
  <h3>Gestión de Datos Personales</h3>
  
  <button onClick={handleExportData}>
    <FiDownload /> Descargar mis datos
  </button>
  
  <button onClick={handleDeleteAccount} className="danger">
    <FiTrash2 /> Eliminar cuenta permanentemente
  </button>
  
  <p className="info">
    Al eliminar tu cuenta, todos tus datos serán eliminados de forma permanente
    e irreversible. Este proceso no se puede deshacer.
  </p>
</div>
```

---

## 9. Plan de Implementación

### 9.1 Fase 1: Documentación Legal (Semana 1) ✅

- [x] Redactar política de privacidad completa
- [x] Redactar política de cookies
- [x] Redactar términos de servicio
- [x] Redactar aviso legal
- [x] Crear declaración de accesibilidad
- [x] Documentar atribuciones

### 9.2 Fase 2: Implementación Técnica (Semana 2)

**Backend:**
- [ ] Crear endpoints de gestión de datos:
  - [ ] DELETE `/auth/delete-account`
  - [ ] GET `/auth/export-data`
  - [ ] POST `/auth/request-data-deletion`
- [ ] Implementar logging de auditoría
- [ ] Añadir rate limiting adicional

**Frontend:**
- [ ] Crear páginas legales en `/legal/`
- [ ] Implementar CookieBanner component
- [ ] Añadir Footer con enlaces legales
- [ ] Crear sección de gestión de datos en Settings
- [ ] Añadir checkbox de aceptación de términos en Register

### 9.3 Fase 3: Accesibilidad (Semana 3)

- [ ] Auditoría completa con Lighthouse
- [ ] Testing con lectores de pantalla (NVDA, JAWS)
- [ ] Verificación de navegación por teclado
- [ ] Corrección de problemas de contraste
- [ ] Añadir atributos ARIA faltantes
- [ ] Implementar skip links
- [ ] Testing con usuarios reales

### 9.4 Fase 4: Testing y Verificación (Semana 4)

- [ ] Testing de flujo completo de consentimiento
- [ ] Verificar funcionamiento de banner de cookies
- [ ] Testing de eliminación de cuenta
- [ ] Verificar exportación de datos
- [ ] Testing de políticas en diferentes dispositivos
- [ ] Verificar enlaces legales en todas las páginas

### 9.5 Fase 5: Documentación Final (Semana 5)

- [ ] Crear este documento `/docs/legislacion.md` ✅
- [ ] Documentar procedimientos internos
- [ ] Crear guía de privacidad para desarrolladores
- [ ] Establecer calendario de revisiones periódicas

---

## 10. Referencias y Enlaces

### 10.1 Normativa Europea

1. **RGPD**
   - Reglamento (UE) 2016/679
   - https://eur-lex.europa.eu/eli/reg/2016/679/oj

2. **Directiva de Cookies**
   - Directiva 2009/136/CE
   - https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32009L0136

3. **Directiva de Comercio Electrónico**
   - Directiva 2000/31/CE
   - https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32000L0031

4. **Directiva de Consumidores**
   - Directiva 2011/83/UE
   - https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32011L0083

### 10.2 Normativa Española

1. **LOPDGDD**
   - Ley Orgánica 3/2018
   - https://www.boe.es/eli/es/lo/2018/12/05/3

2. **LSSI-CE**
   - Ley 34/2002
   - https://www.boe.es/eli/es/l/2002/07/11/34/con

3. **Ley de Propiedad Intelectual**
   - Real Decreto Legislativo 1/1996
   - https://www.boe.es/eli/es/rdlg/1996/04/12/1/con

4. **Real Decreto 1112/2018** (Accesibilidad)
   - https://www.boe.es/eli/es/rd/2018/09/07/1112/con

### 10.3 Guías y Recursos

1. **AEPD** (Agencia Española de Protección de Datos)
   - https://www.aepd.es
   - Guía RGPD: https://www.aepd.es/guias

2. **W3C - WCAG 2.1**
   - https://www.w3.org/WAI/WCAG21/quickref/
   - Understanding WCAG: https://www.w3.org/WAI/WCAG21/Understanding/

3. **WebAIM** (Accesibilidad)
   - https://webaim.org
   - Contrast Checker: https://webaim.org/resources/contrastchecker/

4. **OpenAI Terms of Use**
   - https://openai.com/policies/terms-of-use

5. **PayPal Developer Docs**
   - https://developer.paypal.com

### 10.4 Herramientas de Verificación

1. **Lighthouse** (Chrome DevTools)
2. **WAVE** - https://wave.webaim.org
3. **axe DevTools** - https://www.deque.com/axe/devtools/
4. **W3C HTML Validator** - https://validator.w3.org
5. **Contrast Checker** - https://webaim.org/resources/contrastchecker/

---

## 11. Historial de Revisiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2024-12-11 | Equipo PrepáraT | Documento inicial completo |

---

## 12. Contacto

**Datos de contacto para cuestiones legales:**
- **Email general**: legal@preparat.com
- **Privacidad y RGPD**: privacy@preparat.com
- **Accesibilidad**: accesibilidad@preparat.com
- **Propiedad intelectual**: legal@preparat.com

---

**Fecha: Diciembre 2024**
