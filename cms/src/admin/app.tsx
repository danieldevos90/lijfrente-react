import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app: StrapiApp) {
    // Register custom icon-selector field type
    app.addCustomField({
      name: 'icon-selector',
      pluginId: 'icon-selector',
      type: 'string',
      intlLabel: {
        id: 'icon-selector.label',
        defaultMessage: 'Icon Selector',
      },
      intlDescription: {
        id: 'icon-selector.description',
        defaultMessage: 'Select an icon from the available icons',
      },
      components: {
        Input: async () => {
          const component = await import('./components/IconSelector');
          return component.default;
        },
      },
    });
  },
};

