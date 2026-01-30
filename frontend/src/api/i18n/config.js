
/**
 * @fileoverview Configuración principal de internacionalización (i18n) para la aplicación React.
 * @description Inicializa i18next con soporte para múltiples idiomas (EN, ES, FR, DE) y
 * integra el plugin react-i18next para uso en componentes React. Utiliza localStorage
 * para persistir la preferencia de idioma del usuario.
 * @author Agsergio04
 * @version 1.0.0
 */

/**
 * Importa la librería principal i18next para la gestión de traducciones.
 * @external i18next
 * @see {@link https://www.i18next.com/|i18next}
 */
import i18n from 'i18next';
/**
 * Importa el plugin initReactI18next que habilita el uso de hooks y Context de React
 * con i18next.
 * @external initReactI18next
 * @see {@link https://react.i18next.com/|react-i18next}
 */
import { initReactI18next } from 'react-i18next';
/**
 * @typedef {Object} TranslationResources
 * @property {Object} translation - Objeto que contiene todas las claves de traducción
 * @property {string} translation.* - Valores traducidos para cada clave
 */

/**
 * Importa los recursos de traducción para cada idioma soportado.
 * Cada archivo JSON contiene las traducciones organizadas por namespaces o claves.
 * @type {TranslationResources}
 */
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
/**
 * Objeto que define todos los recursos de traducción disponibles en la aplicación.
 * @type {Object}
 * @property {Object} en - Recursos de traducción en inglés (idioma por defecto)
 * @property {Object} es - Recursos de traducción en español
 * @property {Object} fr - Recursos de traducción en francés  
 * @property {Object} de - Recursos de traducción en alemán
 */
const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de }
};
/**
 * Inicializa la instancia global de i18next con la configuración específica de la aplicación.
 * @description
 * - Carga los recursos de traducción para 4 idiomas
 * - Establece el idioma inicial desde localStorage o 'en' por defecto  
 * - Configura 'en' como idioma de fallback
 * - Desactiva el escape automático para React (manejado por React)
 * @returns {Promise<void>}
 */
i18n
  .use(initReactI18next)
  .init({
    /**
     * Recursos de traducción disponibles para todos los idiomas soportados.
     * @type {Object}
     */
    resources,
    /**
     * Idioma inicial del usuario.
     * @type {string}
     * @default 'en'
     * @description Lee la preferencia desde localStorage o usa 'en' como predeterminado.
     */
    lng: localStorage.getItem('language') || 'en',
    /**
     * Idioma de respaldo cuando la traducción no está disponible.
     * @type {string}
     * @default 'en'
     */
    fallbackLng: 'en',
    /**
     * Configuración de interpolación de variables en las traducciones.
     * @type {Object}
     */
    interpolation: {
       /**
       * Desactiva el escape automático de valores interpolados.
       * @type {boolean}
       * @default false
       * @description React ya maneja el escape de HTML, por lo que i18next no necesita hacerlo.
       */
      escapeValue: false
    }
  });
/**
 * Instancia exportada de i18next configurada y lista para usar en toda la aplicación.
 * @type {import('i18next').i18n}
 * @name default
 * @description
 * Úsala en tus componentes React con los hooks useTranslation(), withTranslation()
 * o el HOC I18nextProvider.
 * 
 * Ejemplo de uso:
 * ```
 * import { useTranslation } from 'react-i18next';
 * 
 * function MyComponent() {
 *   const { t } = useTranslation();
 *   return <p>{t('welcome.message')}</p>;
 * }
 * ```
 */

export default i18n;
/**
 * @namespace i18nConfig
 * @description Espacio de nombres que documenta la configuración global de i18n
 * @property {Array} supportedLngs - ['en', 'es', 'fr', 'de']
 * @property {string} defaultLng - 'en'
 * @property {string} fallbackLng - 'en'
 * @property {boolean} reactIntegration - true (via initReactI18next)
 */

/**
 * Funciones utilitarias recomendadas para usar con esta configuración:
 * @function changeLanguage
 * @param {string} lng - Código del idioma (ej: 'es', 'fr')
 * @example i18n.changeLanguage('es');
 * 
 * @function getCurrentLanguage
 * @returns {string} Código del idioma actual
 * @example const currentLng = i18n.language;
 */