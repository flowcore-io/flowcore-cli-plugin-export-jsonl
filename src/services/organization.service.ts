import {ux} from "@oclif/core";

import {QueryGraphQL} from "../utils/graphql.util.js";
import {
  FETCH_ORGANIZATION_BY_TENANT_GQL_QUERY,
  FetchOrganizationByTenantQueryInput,
  FetchOrganizationByTenantQueryResponse
} from "../utils/queries/fetch-organization-by-tenant.gql.js";

export class OrganizationService {
  private graphqlClient: QueryGraphQL;

  constructor(client: QueryGraphQL) {
    this.graphqlClient = client;
  }

  async fetchOrganization(tenant: string) {
    try {
      const response = await this.graphqlClient.client.request<FetchOrganizationByTenantQueryResponse, FetchOrganizationByTenantQueryInput>(FETCH_ORGANIZATION_BY_TENANT_GQL_QUERY, {
        org: tenant,
      });

      if (response.me.organizations.length === 0) {
        ux.error("Tenant not found");
      }

      return response.me.organizations[0].organization;
    } catch (error: unknown) {
      ux.error(`Error fetching organization: ${error}`);
    }
  }
}