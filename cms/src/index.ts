import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const existing = await strapi.entityService.findMany('api::site.site', {
        filters: { siteId: 'demo' },
        limit: 1,
      });
      if (!Array.isArray(existing) || existing.length === 0) {
        await strapi.entityService.create('api::site.site', {
          data: { siteId: 'demo', name: 'Demo', domain: '' },
        });
        strapi.log.info('Seeded default siteId=demo');
      }
    } catch (e) {
      strapi.log.warn('Seed demo site failed');
    }

    // Ensure Public role has minimal permissions for APIs
    try {
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const allowActions = [
          'api::site.site.find',
          'api::site.site.findOne',
          'api::page.page.find',
          'api::page.page.findOne',
          'api::navigation-item.navigation-item.find',
          'api::navigation-item.navigation-item.findOne',
          'api::token-set.token-set.find',
          'api::token-set.token-set.findOne',
          'api::lead.lead.create',
        ];

        const upsert = async (action: string) => {
          const existingPerm = await strapi.db
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action } });

          if (existingPerm) {
            if (!existingPerm.enabled) {
              await strapi.db
                .query('plugin::users-permissions.permission')
                .update({ where: { id: existingPerm.id }, data: { enabled: true } });
            }
          } else {
            await strapi.db
              .query('plugin::users-permissions.permission')
              .create({ data: { action, role: publicRole.id, enabled: true } });
          }
        };

        for (const a of allowActions) {
          // eslint-disable-next-line no-await-in-loop
          await upsert(a);
        }

        strapi.log.info('Public role permissions updated for API access');
      }
    } catch (e) {
      strapi.log.warn('Failed to ensure Public role permissions');
    }
  },
};
