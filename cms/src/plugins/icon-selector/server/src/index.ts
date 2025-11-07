import type { Core } from '@strapi/strapi';

export default {
  /**
   * Register function runs before application initialization
   * This is where we register the custom field so it's available during schema validation
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Register the custom field at server level
    // This makes it available during schema validation
    strapi.customFields.register({
      name: 'icon-selector',
      plugin: 'icon-selector',
      type: 'string',
    });

    strapi.log.info('Icon Selector plugin: Custom field registered');
  },

  /**
   * Bootstrap function runs after application initialization
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    // Additional initialization if needed
  },
};

