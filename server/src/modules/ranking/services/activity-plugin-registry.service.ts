import { Injectable, Logger } from '@nestjs/common';
import { IActivityPlugin } from '../../../common/types';

@Injectable()
export class ActivityPluginRegistry {
  private readonly logger = new Logger(ActivityPluginRegistry.name);
  private readonly plugins = new Map<string, IActivityPlugin>();

  register(plugin: IActivityPlugin): void {
    if (this.plugins.has(plugin.id)) {
      this.logger.warn(`Plugin with id '${plugin.id}' already registered. Overwriting.`);
    }
    
    this.plugins.set(plugin.id, plugin);
    this.logger.log(`Registered activity plugin: ${plugin.displayName} (${plugin.id})`);
  }

  getPlugin(id: string): IActivityPlugin {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Activity plugin not found: ${id}`);
    }
    return plugin;
  }

  getAllPlugins(): IActivityPlugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginIds(): string[] {
    return Array.from(this.plugins.keys());
  }

  hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }

  getPluginCount(): number {
    return this.plugins.size;
  }
}