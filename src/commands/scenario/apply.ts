import {BaseCommand} from "@flowcore/cli-plugin-config";
import {Flags, ux} from "@oclif/core";
import {colorize} from "@oclif/core/lib/cli-ux/index.js";

import {FlowcoreManifest, FlowcoreManifestDto} from "../../dtos/scenario-manifest.dto.js";
import {OrganizationService} from "../../services/organization.service.js";
import {FetchManifestUtil} from "../../utils/fetch-manifest.util.js";
import {ClientFactory} from "../../utils/graphql.util.js";

type ExecutionPlan = {
  action: "create" | "delete" | "in-sync" | "update";
  deleteProtection?: boolean;
  description?: string;
  existing: boolean;
  id: string;
  isPublic?: boolean;
  name: string;
  parent?: string;
  type: "dataCore" |  "eventType" | "flowType";
}

export default class Apply extends BaseCommand<typeof Apply> {
  static args = {}

  static description = 'Apply a manifest configuration for a Scenario to the Flowcore Platform'

  static examples = [
    '<%= config.bin %> <%= command.id %> -t flowcore -f example.yaml',
    '<%= config.bin %> <%= command.id %> -t flowcore -n scenario-name -f example.yaml',
    '$ cat <<EOF | <%= config.bin %> <%= command.id %> -f -',
  ]

  static flags = {
    file: Flags.string({char: 'f', description: 'file to apply', multiple: true, required: true}),
    name: Flags.string({char: 'n', description: 'name of the scenario to apply'}),
    tenant: Flags.string({char: 't', description: 'tenant to apply the scenario to, this is the org for your organization, it can be seen in the url when accessing your organization'}),
    yes: Flags.boolean({char: 'y', description: 'skip confirmation'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Apply)

    const yaml = await FetchManifestUtil.fetchManifest(flags.file, FlowcoreManifestDto);

    if (flags.name) {
      yaml.scenario.name = flags.name;
    }

    if (flags.tenant) {
      yaml.tenant = flags.tenant;
    }

    if (!yaml.tenant) {
      ux.error("Tenant is required");
    }

    const graphqlClient = await ClientFactory.create(this.cliConfiguration);

    ux.action.start("Gathering Tenant Information");
    const organizationService = new OrganizationService(graphqlClient);
    const organization = await organizationService.fetchOrganization(yaml.tenant);
    ux.action.stop();

    // const dataCoreService = new DataCoreService(graphqlClient, organization.id);

    const executionPlan: ExecutionPlan[] = await this.createExecutionPlan(yaml, /* dataCoreService */);

    this.displayExecutionPlan(executionPlan, yaml.tenant);

    if (flags.yes) {
      await this.applyExecutionPlan(executionPlan, /* dataCoreService */);
      return;
    }

    const answer = await ux.confirm("Would you like to apply this plan? (y/n)");

    if (answer) {
      await this.applyExecutionPlan(executionPlan, /* dataCoreService */);
    } else {
      ux.log("Aborting");
    }
  }

  private async applyExecutionPlan(executionPlan: ExecutionPlan[], /* dataCoreService: DataCoreService */) {
    ux.action.start("Applying execution plan");
    // const dataCores = executionPlan.filter((plan) => plan.type === "dataCore");
    //
    // for (const dataCore of dataCores) {
    //
    //   // eslint-disable-next-line no-await-in-loop
    //   const dataCoreId = await this.processDataCoreExecutionPlan(dataCore, dataCoreService);
    //
    //   const flowTypes = executionPlan.filter((plan) => plan.type === "flowType" && plan.parent === dataCore.id);
    //
    //   for (const flowType of flowTypes) {
    //     // eslint-disable-next-line no-await-in-loop
    //     const { deleted, flowTypeId } = await this.processFlowTypeExecutionPlan(flowType, dataCoreId, dataCoreService);
    //
    //     const eventTypes = executionPlan.filter((plan) => plan.type === "eventType" && plan.parent === flowType.id);
    //
    //     for (const eventType of eventTypes) {
    //       // eslint-disable-next-line no-await-in-loop
    //       await this.processEventTypeExecutionPlan(eventType, dataCoreId, flowTypeId, dataCoreService, deleted);
    //     }
    //   }
    // }

    ux.action.stop();
  }

  // private async createDataCorePlan({deleteProtection, description, isPublic, name}: DataCore, dataCoreService: DataCoreService, executionPlan: ExecutionPlan[]) {
  //
  //   const existingDataCore = await dataCoreService.fetchDataCore(name);
  //
  //   if (existingDataCore) {
  //
  //     const existingDeleteProtection = existingDataCore.configuration?.find((config) => config.key === DELETE_PROTECTION_KEY)?.value === "true";
  //
  //     executionPlan.push({
  //       action: (existingDataCore.description === description && deleteProtection === existingDeleteProtection) ? "in-sync" : "update",
  //       deleteProtection,
  //       description,
  //       existing: true,
  //       id: existingDataCore.id,
  //       isPublic,
  //       name,
  //       type: "dataCore",
  //     });
  //
  //     return {
  //       existing: true,
  //       id: existingDataCore.id
  //     };
  //   }
  //
  //   const id = uuidv4();
  //   executionPlan.push({
  //     action: "create",
  //     deleteProtection,
  //     description,
  //     existing: false,
  //     id,
  //     isPublic,
  //     name,
  //     type: "dataCore",
  //   });
  //
  //   return {
  //     existing: false,
  //     id
  //   };
  // }

  // private async createEventTypePlan(eventType: EventType, dataCore: DataCoreService, executionPlan: ExecutionPlan[], parent: {
  //   existing: boolean;
  //   id: string;
  // }) {
  //   const id = uuidv4();
  //   if (!parent.existing) {
  //     executionPlan.push({
  //       action: "create",
  //       deleteProtection: eventType.deleteProtection,
  //       description: eventType.description,
  //       existing: false,
  //       id,
  //       name: eventType.name,
  //       parent: parent.id,
  //       type: "eventType",
  //     });
  //
  //     return {
  //       existing: false,
  //       id,
  //     };
  //   }
  //
  //   const existingEventType = await dataCore.fetchEventType(parent.id, eventType.name);
  //
  //   if (existingEventType) {
  //
  //     const existingDeleteProtection = existingEventType.configuration?.find((config) => config.key === DELETE_PROTECTION_KEY)?.value === "true";
  //
  //     executionPlan.push({
  //       action: (existingEventType.description === eventType.description && eventType.deleteProtection === existingDeleteProtection) ? "in-sync" : "update",
  //       deleteProtection: eventType.deleteProtection,
  //       description: eventType.description,
  //       existing: true,
  //       id: existingEventType.id,
  //       name: eventType.name,
  //       parent: parent.id,
  //       type: "eventType",
  //     });
  //
  //     return {
  //       existing: true,
  //       id: existingEventType.id,
  //     };
  //   }
  //
  //   executionPlan.push({
  //     action: "create",
  //     deleteProtection: eventType.deleteProtection,
  //     description: eventType.description,
  //     existing: false,
  //     id,
  //     name: eventType.name,
  //     parent: parent.id,
  //     type: "eventType",
  //   });
  //
  //   return {
  //     existing: false,
  //     id,
  //   };
  //
  // }

  private async createExecutionPlan(yaml: FlowcoreManifest, /* dataCore: DataCoreService */): Promise<ExecutionPlan[]> {
    ux.action.start("Creating execution plan");
    const executionPlan: ExecutionPlan[] = [];

    // const dataCoreResult = await this.createDataCorePlan(yaml.dataCore, dataCore, executionPlan);
    //
    // if (dataCoreResult.existing) {
    //   await this.processDeleteDataCoreExecutionPlan(yaml.dataCore, dataCore, executionPlan, dataCoreResult);
    // }
    //
    // for (const flowType of yaml.dataCore.flowTypes) {
    //   // eslint-disable-next-line no-await-in-loop
    //   const flowTypeResult = await this.createFlowTypePlan(flowType, dataCore, executionPlan, dataCoreResult);
    //
    //   if (flowTypeResult.existing) {
    //     // eslint-disable-next-line no-await-in-loop
    //     await this.processDeleteFlowTypeExecutionPlan(flowType, dataCore, executionPlan, flowTypeResult, dataCoreResult.id);
    //   }
    //
    //   for (const eventType of flowType.eventTypes) {
    //     // eslint-disable-next-line no-await-in-loop
    //     await this.createEventTypePlan(eventType, dataCore, executionPlan, flowTypeResult);
    //   }
    // }

    ux.action.stop();

    return executionPlan;
  }

  // private async createFlowTypePlan(flowType: FlowType, dataCore: DataCoreService, executionPlan: ExecutionPlan[], parent: {
  //   existing: boolean;
  //   id: string;
  // }) {
  //   const id = uuidv4();
  //
  //   if (!parent.existing) {
  //     executionPlan.push({
  //       action: "create",
  //       deleteProtection: flowType.deleteProtection,
  //       description: flowType.description,
  //       existing: false,
  //       id,
  //       name: flowType.name,
  //       parent: parent.id,
  //       type: "flowType",
  //     });
  //
  //     return {
  //       existing: false,
  //       id
  //     };
  //   }
  //
  //   const existingFlowType = await dataCore.fetchFlowType(parent.id, flowType.name);
  //
  //   if (existingFlowType) {
  //
  //     const existingDeleteProtection = existingFlowType.configuration?.find((config) => config.key === DELETE_PROTECTION_KEY)?.value === "true";
  //
  //     executionPlan.push({
  //       action: (existingFlowType.description === flowType.description && flowType.deleteProtection === existingDeleteProtection) ? "in-sync" : "update",
  //       deleteProtection: flowType.deleteProtection,
  //       description: flowType.description,
  //       existing: true,
  //       id: existingFlowType.id,
  //       name: flowType.name,
  //       parent: parent.id,
  //       type: "flowType",
  //     });
  //
  //     return {
  //       existing: true,
  //       id: existingFlowType.id,
  //     };
  //   }
  //
  //
  //   executionPlan.push({
  //     action: "create",
  //     deleteProtection: flowType.deleteProtection,
  //     description: flowType.description,
  //     existing: false,
  //     id,
  //     name: flowType.name,
  //     parent: parent.id,
  //     type: "flowType",
  //   });
  //
  //   return {
  //     existing: false,
  //     id
  //   };
  //
  // }

  private displayColor(row: ExecutionPlan, text?: string) {
    switch (row.action) {
      case "create": {
        return ux.colorize("green", text || "");
      }

      case "delete": {
        return ux.colorize("red", text || "");
      }

      case "update": {
        return ux.colorize("yellow", text || "");
      }

      case "in-sync": {
        return ux.colorize("white", text || "");
      }
    }
  }

  private displayExecutionPlan(executionPlan: ExecutionPlan[], tenant: string) {
    ux.log(`This plan will perform the following actions on the ${colorize("whiteBright", tenant)} tenant:\n`);

    // const dataCores = executionPlan.filter((plan) => plan.type === "dataCore");
    //
    // for (const [i, dataCore] of dataCores.entries()) {
    //   const prefix = (i === dataCores.length - 1) ? '-' : '-';
    //   ux.log(this.displayColor(dataCore, `${prefix} ${dataCore.action} Data Core - name: ${colorize("bold", dataCore.name)}, description: ${dataCore.description || "none"} ${
    //     `(${dataCore.isPublic ? "public" : "private"})`
    //   } ${
    //     `${dataCore.deleteProtection ? colorize("whiteBright","(delete protected)") : ""}`
    //   }`));
    //
    //   const flowTypes = executionPlan.filter((plan) => plan.type === "flowType" && plan.parent === dataCore.id);
    //   for (const [j, flowType] of flowTypes.entries()) {
    //     const flowPrefix = (j === flowTypes.length - 1) ? '   └─' : '   ├─';
    //     ux.log(this.displayColor(flowType, `${flowPrefix} ${flowType.action} Flow Type - name: ${colorize("bold", flowType.name)}, description: ${flowType.description || "none"} ${
    //       `${flowType.deleteProtection ? colorize("whiteBright","(delete protected)") : ""}`
    //     }`));
    //
    //     const eventTypes = executionPlan.filter((plan) => plan.type === "eventType" && plan.parent === flowType.id);
    //     const flowTypePrefix = (j === flowTypes.length - 1) ? '    ' : '   │';
    //     for (const [k, eventType] of eventTypes.entries()) {
    //       const eventTypePrefix = (k === eventTypes.length - 1) ? `${flowTypePrefix}  └─` : `${flowTypePrefix}  ├─`;
    //       ux.log(this.displayColor(eventType, `${eventTypePrefix} ${eventType.action} Event Type - name: ${colorize("bold", eventType.name)}, description: ${eventType.description || "none"} ${
    //         `${eventType.deleteProtection ? colorize("whiteBright","(delete protected)") : ""}`
    //       }`));
    //     }
    //   }
    // }
  }

  // private async processDataCoreExecutionPlan(dataCore: ExecutionPlan, dataCoreService: DataCoreService) {
  //   switch (dataCore.action) {
  //     case "create" : {
  //       const dataCoreId = await dataCoreService.createDataCore({
  //         description: dataCore.description,
  //         isPublic: dataCore.isPublic || false,
  //         ...(dataCore.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: dataCore.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //         name: dataCore.name,
  //       });
  //
  //       ux.log(`✅ Created Data Core: ${colorize("greenBright", dataCore.name)}`);
  //
  //       return dataCoreId;
  //     }
  //
  //     case "update": {
  //       await dataCoreService.updateDataCore(dataCore.id, {
  //         description: dataCore.description || "",
  //         ...(dataCore.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: dataCore.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //       });
  //
  //       ux.log(`✏️ Updated Data Core: ${colorize("yellowBright", dataCore.name)}`);
  //
  //       return dataCore.id;
  //     }
  //   }
  //
  //   ux.log(`✔️ Data Core: ${colorize("white", dataCore.name)} is in sync`);
  //   return dataCore.id;
  // }
  //
  // private async processDeleteDataCoreExecutionPlan(dataCore: DataCore, dataCoreService: DataCoreService, executionPlan: ExecutionPlan[], dataCoreResult: {
  //   existing: boolean;
  //   id: string
  // }) {
  //   const existingDataCore = await dataCoreService.fetchDataCoreById(dataCoreResult.id);
  //
  //   for (const flowType of existingDataCore?.flowtypes || []) {
  //     if (!dataCore.flowTypes.some((e) => e.name === flowType.name)) {
  //       executionPlan.push({
  //         action: "delete",
  //         description: flowType.description,
  //         existing: true,
  //         id: flowType.id,
  //         name: flowType.name,
  //         parent: dataCoreResult.id,
  //         type: "flowType",
  //       });
  //     }
  //   }
  // }
  //
  // private async processDeleteFlowTypeExecutionPlan(flowType: FlowType, dataCore: DataCoreService, executionPlan: ExecutionPlan[], flowTypeResult: {
  //   existing: boolean;
  //   id: string;
  // }, dataCoreId: string) {
  //
  //   const existingFlowType = await dataCore.fetchFlowType(dataCoreId, flowType.name);
  //
  //   for (const eventType of existingFlowType?.events || []) {
  //     if (!flowType.eventTypes.some((e) => e.name === eventType.name)) {
  //       executionPlan.push({
  //         action: "delete",
  //         description: eventType.description,
  //         existing: true,
  //         id: eventType.id,
  //         name: eventType.name,
  //         parent: flowTypeResult.id,
  //         type: "eventType",
  //       });
  //     }
  //   }
  // }
  //
  // private async processEventTypeExecutionPlan(eventType: ExecutionPlan, dataCoreId: string, flowTypeId: string, dataCoreService: DataCoreService, parentDeleted = false) {
  //   switch (eventType.action) {
  //     case "create" : {
  //       const eventTypeId = await dataCoreService.createEventType({
  //         dataCoreId,
  //         description: eventType.description,
  //         ...(eventType.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: eventType.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //         flowTypeId,
  //         name: eventType.name,
  //       });
  //
  //       ux.log(`✅ Created Event Type: ${colorize("greenBright", eventType.name)}`);
  //
  //       return eventTypeId;
  //     }
  //
  //     case "update": {
  //       await dataCoreService.updateEventType(eventType.id, {
  //         description: eventType.description || "",
  //         ...(eventType.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: eventType.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //       });
  //
  //       ux.log(`✏️ Updated Event Type: ${colorize("yellowBright", eventType.name)}`);
  //
  //       return eventType.id;
  //     }
  //
  //     case "delete": {
  //       if (!parentDeleted) {
  //         await dataCoreService.deleteEventType(eventType.id);
  //       }
  //
  //       ux.log(`❌ Deleted Event Core: ${colorize("yellowBright", eventType.name)}`);
  //
  //       return eventType.id;
  //     }
  //   }
  //
  //   ux.log(`✔️ Event Type: ${colorize("white", eventType.name)} is in sync`);
  //   return eventType.id;
  // }
  //
  // private async processFlowTypeExecutionPlan(flowType: ExecutionPlan, dataCoreId: string, dataCoreService: DataCoreService) {
  //   switch (flowType.action) {
  //     case "create" : {
  //       const flowTypeId = await dataCoreService.createFlowType({
  //         description: flowType.description,
  //         name: flowType.name,
  //         parentId: dataCoreId,
  //         ...(flowType.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: flowType.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //       });
  //
  //       ux.log(`✅ Created Flow Type: ${colorize("greenBright", flowType.name)}`);
  //
  //       return {
  //         flowTypeId
  //       };
  //     }
  //
  //     case "update": {
  //       await dataCoreService.updateFlowType(dataCoreId, flowType.id, {
  //         description: flowType.description || "",
  //         ...(flowType.deleteProtection !== undefined && {
  //           configuration: [
  //             {
  //               key: DELETE_PROTECTION_KEY,
  //               value: flowType.deleteProtection ? "true" : "false",
  //             },
  //           ],
  //         }),
  //       });
  //
  //       ux.log(`✏️ Updated Flow Type: ${colorize("yellowBright", flowType.name)}`);
  //
  //       return {
  //         flowTypeId: flowType.id
  //       };
  //     }
  //
  //     case "delete": {
  //       await dataCoreService.deleteFlowType(dataCoreId, flowType.id);
  //
  //       ux.log(`❌ Deleted Flow Type: ${colorize("yellowBright", flowType.name)}`);
  //
  //       return {
  //         deleted: true,
  //         flowTypeId: flowType.id,
  //       };
  //     }
  //   }
  //
  //   ux.log(`✔️ Flow Type: ${colorize("white", flowType.name)} is in sync`);
  //   return {
  //     flowTypeId: flowType.id
  //   };
  // }
}
