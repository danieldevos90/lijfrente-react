import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  /**
   * Register function runs when admin panel is initialized
   */
  register(app: StrapiApp) {
    // Register custom icon-selector field type in admin panel
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
          const component = await import('../../../../admin/components/IconSelector');
          return component.default;
        },
      },
    });
  },

  /**
   * Bootstrap function runs after admin panel is initialized
   */
  bootstrap(/* app: StrapiApp */) {
    // Additional admin-side initialization if needed
  },
};

