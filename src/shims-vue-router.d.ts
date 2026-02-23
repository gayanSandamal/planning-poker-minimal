/* eslint-disable */
declare module "vue-router" {
  import type { Component } from "vue";
  export interface RouteRecordRaw {
    path: string;
    name?: string;
    component?: Component | (() => Promise<Component>);
    children?: RouteRecordRaw[];
    meta?: Record<string, unknown>;
    redirect?: string | { name: string } | (() => string | { name: string });
    [key: string]: unknown;
  }
  export function createRouter(options: {
    history: ReturnType<typeof createWebHistory>;
    routes: RouteRecordRaw[];
    scrollBehavior?: () => unknown;
  }): {
    push: (to: string | { name: string; params?: Record<string, string> }) => Promise<unknown>;
    replace: (to: string | { name: string; params?: Record<string, string> }) => Promise<unknown>;
    currentRoute: { value: { name: string; params: Record<string, string> } };
    install: (app: unknown) => void;
  };
  export function createWebHistory(base?: string): unknown;
}
